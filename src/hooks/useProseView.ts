import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'

import { Node } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

export function useProseView(
  value: { [key: string]: any } | null | undefined,
  state: EditorState,
  ref: React.MutableRefObject<EditorView>
) {
  const [view, setView] = React.useState<EditorView>()
  const contentEditableDom = React.useRef(document.createElement('div'))

  // initialize view with state
  React.useEffect(() => {
    if (!view) {
      setView(
        new EditorView(contentEditableDom.current, {
          state
        })
      )
    }
  }, [view, state])

  // for a controlled prop:
  // refresh the view with a new state whenever the value prop changes
  React.useLayoutEffect(() => {
    if (view && value) {
      const valueNode = Node.fromJSON(view.state.schema, value)
      if (!view?.state.doc.eq(valueNode)) {
        try {
          // todo: change to apply transaction and replace the contents (instead of recreating the whole state)
          view?.updateState(
            EditorState.create({
              schema: view.state.schema,
              doc: valueNode,
              plugins: view.state.plugins
            })
          )
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [value, view])

  React.useLayoutEffect(() => {
    try {
      console.log('updating view because state changed')
      // todo: change to apply transaction and replace the contents (instead of recreating the whole state)
      view?.updateState(state)
    } catch (e) {
      console.error(e)
    }
  }, [state])

  // for forwarding editorView as ref:
  // set the ref object to the prosemirror editorView
  // This will make the editorView accessible to the parent.
  React.useEffect(() => {
    if (view && ref) {
      ref.current = view
    }
  }, [view, ref])

  return contentEditableDom
}
