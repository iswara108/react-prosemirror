import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import { Node, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { useSyncPlugin, onChangeType } from '../plugins/syncStatePlugin'

// hook to create a plugin which enables the component to be
// a "Controlled Component". It is only active if
// props "value" and "onChange" are supplied to the component.
export function useControlled(
  value: { [key: string]: any } | null | undefined,
  onChange: onChangeType,
  view: EditorView | undefined,
  schema: Schema
) {
  // create a sync plugin which calls a callback prop whenever the view changes.
  // pass ref callback which is updated when the onChange prop is renewed.
  const refOnChange = React.useRef(onChange)
  const syncStatePlugin = useSyncPlugin(refOnChange)

  // update refOnChange's current value to the onChange callback.
  // the refOnChange object is passed by reference to the sync plugin during initialization
  React.useEffect(() => {
    refOnChange.current = onChange
  }, [onChange])

  // refresh the view with a new state whenever the value prop changes
  React.useLayoutEffect(() => {
    if (value) {
      const valueNode = Node.fromJSON(schema, value)
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
  }, [value, view, schema])

  return syncStatePlugin
}
