import { Plugin, PluginKey } from 'prosemirror-state'

// controlled component's "onChange" prop type
export type onChangeType = (stringifiedNode: string) => void

// this plugin needs to be the last one defined, to capture the last state on a sequence of plugin intervention.
// on each update to the document, the state has to be reconfigured with a new plugin because it stores the onChange callback.
// For a proper controlled component, the onChange prop has to be a fresh dispatching function with the current value.
export const useSyncPlugin = (onChange: undefined | onChangeType) =>
  onChange
    ? new Plugin<{ value: string }>({
        key: new PluginKey('Sync State Plugin'),
        view: () => ({
          update: (view, prevState) => {
            if (!prevState.doc.eq(view.state.doc)) {
              onChange(JSON.stringify(view.state.doc))
            }
          }
        })
      })
    : undefined
