import * as React from 'react'
import { Plugin, PluginKey } from 'prosemirror-state'

// controlled component's "onChange" prop type
export type onChangeType =
  | ((jsonNode: { [key: string]: any }) => void)
  | undefined

// fires an "onChange" callback on each update in content in a prosemirror view.
// this is necessary for controlled components.
// the "refOnChange" callback must be a mutable object which will hold its
// reference throughout the component's lifetime because it is passed to the
// plugin only during intialization.
export function contentUpdateHookPlugin(
  refOnChange: React.MutableRefObject<onChangeType>
) {
  return new Plugin({
    key: new PluginKey('Content Update Hook Plugin'),
    view: () => ({
      update: (view, prevState) => {
        if (!prevState.doc.eq(view.state.doc)) {
          refOnChange.current?.(view.state.doc.toJSON())
        }
      }
    })
  })
}
