import * as React from 'react'
import { Plugin, PluginKey } from 'prosemirror-state'

// controlled component's "onChange" prop type
export type onChangeType = undefined | ((stringifiedNode: string) => void)

// fires an "onChange" callback whenever the prosemirror view is updated.
// this is necessary for controlled components.
// the "onChange" callback must be a mutable object which will hold its
// reference throughout the component's lifetime because it is passed to the
// plugin in intialization.
export const useSyncPlugin = (
  onChange: React.MutableRefObject<(val: string) => void | undefined>
) =>
  new Plugin<{ value: string }>({
    key: new PluginKey('Sync State Plugin'),
    view: () => ({
      update: (view, prevState) => {
        if (!prevState.doc.eq(view.state.doc)) {
          onChange.current(JSON.stringify(view.state.doc))
        }
      }
    })
  })
