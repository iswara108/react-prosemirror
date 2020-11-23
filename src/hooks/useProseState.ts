import * as React from 'react'
import { Plugin, PluginKey } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { readOnlyPlugin } from '../plugins/readOnlyPlugin'

import { Node, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

// controlled component's "onChange" prop type
export type onChangeType =
  | ((jsonNode: { [key: string]: any }) => void)
  | undefined

// create a plugin to fire the onChange event whenever the editorState changes,
// a read only plugin to deactivate any transaction, and create the editorState.
export function useProseState(
  onChange: onChangeType,
  schema: Schema,
  readOnly: boolean
) {
  // create a sync plugin which calls a callback prop whenever the view changes.
  // pass ref callback which is updated when the onChange prop is renewed.
  const refOnChange = React.useRef<onChangeType>(onChange)

  // update refOnChange's current value to the onChange callback.
  // the refOnChange object is passed by reference to the sync plugin during initialization
  React.useEffect(() => {
    refOnChange.current = onChange
  }, [onChange])

  const plugins = exampleSetup({ schema })
    .concat((readOnly && readOnlyPlugin()) || [])
    .concat(syncStatePlugin(refOnChange))

  const doc = createEmptyDocument(schema)

  const editorState = EditorState.create({ schema, doc, plugins })
  return editorState
}

// default empty document
function createEmptyDocument(schema: Schema) {
  return Node.fromJSON<Schema>(schema, {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
}

// fires an "onChange" callback whenever the prosemirror view is updated.
// this is necessary for controlled components.
// the "refOnChange" callback must be a mutable object which will hold its
// reference throughout the component's lifetime because it is passed to the
// plugin only during intialization.
function syncStatePlugin(refOnChange: React.MutableRefObject<onChangeType>) {
  return new Plugin({
    key: new PluginKey('Sync State Plugin'),
    view: () => ({
      update: (view, prevState) => {
        if (!prevState.doc.eq(view.state.doc)) {
          refOnChange.current?.(view.state.doc.toJSON())
        }
      }
    })
  })
}
