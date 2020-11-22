import * as React from 'react'
import { EditorView } from 'prosemirror-view'

export default function useRefEditorView(
  ref: React.MutableRefObject<EditorView> | undefined,
  view: EditorView | undefined
) {
  // set the ref object to the prosemirror editorView
  // This will make the editorView accessible to the parent.
  React.useEffect(() => {
    if (view && ref) {
      ref.current = view
    }
  }, [view, ref])
}
