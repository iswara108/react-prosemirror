// import * as React from 'react'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'

// controlled component's "onChange" prop type
export type onChangeType =
  | ((jsonNode: { [key: string]: any }) => void)
  | undefined

// fires an "onChange" callback on each update in state in a prosemirror view.
// this is necessary for tracking of any type of update, including selection.
// the "refOnChange" callback must be a mutable object which will hold its
// reference throughout the component's lifetime because it is passed to the
// plugin only during intialization.
export function stateUpdateHookPlugin(
  callback: (newState: EditorState, prevState: EditorState) => void
) {
  return new Plugin({
    key: new PluginKey('State Update Hook Plugin'),
    view: () => ({
      update: (view, prevState) => {
        if (JSON.stringify(prevState) !== JSON.stringify(view.state)) {
          callback(view.state, prevState)
        }
      }
    })
  })
}
