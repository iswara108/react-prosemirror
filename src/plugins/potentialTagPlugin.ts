import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey, Selection } from 'prosemirror-state'
import { Node } from 'prosemirror-model'
import { findAllHashtags } from '../textUtils/tagUtils'

function decoratePotentialTags(doc: Node, _selection: Selection) {
  const allHashtags = findAllHashtags(doc)
  return DecorationSet.create(
    doc,
    allHashtags.map(hashtag =>
      Decoration.inline(hashtag.start + 1, hashtag.end + 1, {
        class: 'editing-hashtag'
      })
    )
  )
}

// This plugin serves two purposes:
// 1. Decorate potential tags. A potential tag is a tag which is editable,
//    and can be resolved into an immutable tag.
// 2. Disables the "enter" key when the cursor is on a tag being edited, designating it to resolving a tag from the list of suggestions
const potentialTagsPlugin = new Plugin({
  key: new PluginKey('Potential Tag Plugin'),
  state: {
    init(_, instance) {
      return decoratePotentialTags(instance.doc, instance.selection)
    },

    apply(tr, _oldDecoration) {
      return decoratePotentialTags(tr.doc, (tr as any).curSelection)
    }
  },
  props: {
    decorations(editorState) {
      return this.getState(editorState)
    }

    // disable until suggestions dropdown is implemented

    // handleDOMEvents: {
    //   keydown: (view, event) => {
    //     // In case of a multiline view, disable "Enter" key when a tag is being edited to allow resolving tag via the "Enter" key.
    //     if (event.key === 'Enter') {
    //       const currentEditingTag = findEditingHashtag(
    //         view.state.doc,
    //         view.state.selection
    //       )
    //       if (currentEditingTag) event.preventDefault()
    //     }
    //     // todo: Maybe return true?
    //     return false
    //   }
    // }
  }
})

export default potentialTagsPlugin
