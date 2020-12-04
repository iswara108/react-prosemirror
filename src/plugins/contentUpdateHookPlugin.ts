// import * as React from 'react'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'

// fires an "onChange" callback on each update in content in a prosemirror view.
// this is necessary for controlled components.
// the callback must have access to updating the editorState.
export function contentUpdateHookPlugin(callBackObj: {
  update: (newState: EditorState) => void
}) {
  return new Plugin({
    key: new PluginKey('Content Update Hook Plugin'),
    view: () => ({
      update: (view, prevState) => {
        if (!prevState.doc.eq(view.state.doc)) {
          callBackObj.update(view.state)
        }
      }
    })
  })
}
