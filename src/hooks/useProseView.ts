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

  // todo: this works but it also works unintentionally on first render when the state is empty. See why that is and how to go around it
  React.useLayoutEffect(() => {
    if (view && state) {
      console.log('prev state: ', JSON.stringify(view.state))
      console.log('next state: ', JSON.stringify(state))
      view.updateState(state)
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
