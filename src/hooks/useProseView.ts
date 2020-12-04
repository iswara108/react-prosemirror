import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'

import { EditorState } from 'prosemirror-state'

export function useProseView(
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

  React.useLayoutEffect(() => {
    if (view && state) {
      if (!view.state.doc.eq(state.doc)) {
        view.updateState(state)
      }
    }
  }, [view, state])

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
