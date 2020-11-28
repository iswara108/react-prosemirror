import {
  Plugin,
  PluginKey,
  TextSelection,
  NodeSelection
} from 'prosemirror-state'
import { Node, ResolvedPos } from 'prosemirror-model'

const createImmutablePlugin = (immutableNodeTypes: string[]) =>
  new Plugin({
    key: new PluginKey('Immutable Plugin'),

    props: {
      // If a text is input on the borders of the immutable node - insert as plain text.

      handleTextInput(view, from, _to, text) {
        if (
          immutableNodeTypes.some(
            nodeType =>
              view.state.doc.resolve(from).parent.type.name === nodeType
          )
        ) {
          view.dispatch(view.state.tr.insertText(text))
          return true
        }
        return false
      },

      // completes any selection to encompass any tag within it
      createSelectionBetween(_view, anchor, head) {
        function isEdgeOnImmutable(selectionEdge: ResolvedPos) {
          return immutableNodeTypes.some(
            nodeType =>
              selectionEdge.node(selectionEdge.depth).type.name === nodeType
          )
        }

        console.log('interfering with selection', anchor, head)

        const newAnchor = isEdgeOnImmutable(anchor)
          ? head.pos >= anchor.pos
            ? anchor.doc.resolve(anchor.before(anchor.depth))
            : anchor.doc.resolve(anchor.after(anchor.depth))
          : anchor

        const newHead = isEdgeOnImmutable(head)
          ? head.pos >= anchor.pos
            ? head.doc.resolve(head.after(head.depth))
            : head.doc.resolve(head.before(head.depth))
          : head

        console.log('new head', newHead)

        console.log('new anchor', newAnchor)
        const hashtagSelection = // create the selection
          newHead.nodeAfter &&
          newAnchor.nodeBefore &&
          newHead.nodeAfter === newAnchor.nodeBefore // as a NodeSelection if the hashtag is the only element selected
            ? new NodeSelection(newHead)
            : new TextSelection(newAnchor, newHead) // or as a TextSelection in any other case

        return hashtagSelection
      }
    },

    // for any change in the document (namely - transaction),
    // construct an array of all tags in the current state,
    // and a parallel array of tags from the new transcation,
    // and compares both while considering position mapping if the tag's
    // position is changed in a transaction.
    // If both original and new tags exist but their content is not identical -
    // then the entire transaction is disabled.
    filterTransaction(transaction, editorState) {
      let changeInTag = false

      const tagsInCurrentState: { node: Node; pos: number }[] = [],
        tagsInTransaction: { node: Node; pos: number }[] = []

      editorState.doc.descendants((node, pos) => {
        if (immutableNodeTypes.some(nodeType => node.type.name === nodeType))
          tagsInCurrentState.push({ node, pos })
      })
      transaction.doc.descendants((node, pos) => {
        if (immutableNodeTypes.some(nodeType => node.type.name === nodeType))
          tagsInTransaction.push({ node, pos })
      })

      tagsInTransaction.forEach(transactionInTag => {
        const correspondingTag = tagsInCurrentState.find(
          tagInCurrentState =>
            tagInCurrentState.pos ===
            (transaction.mapping as any).invert().map(transactionInTag.pos)
        )

        if (
          correspondingTag &&
          transactionInTag.node.textContent !==
            correspondingTag.node.textContent
        )
          changeInTag = true
      })

      return !changeInTag
    }
  })

export default createImmutablePlugin
