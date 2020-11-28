import * as React from 'react'
import { Node, Schema } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { readOnlyPlugin } from '../plugins/readOnlyPlugin'
import {
  contentUpdateHookPlugin,
  onChangeType
} from '../plugins/contentUpdateHookPlugin'

// create a plugin to fire the onChange event whenever the editorState changes,
// a read only plugin to deactivate any transaction, and create the editorState.
function useProseState(
  onChange: onChangeType,
  schema: Schema,
  readOnly: boolean,
  additionalPlugins: Plugin[] = []
): EditorState {
  // create a sync plugin which calls a callback prop whenever the view changes.
  // pass ref callback which is updated when the onChange prop is renewed.
  const refOnChange = React.useRef<onChangeType>(onChange)

  // update refOnChange's current value to the onChange callback.
  // the refOnChange object is passed by reference to the sync plugin during initialization
  React.useEffect(() => {
    refOnChange.current = onChange
  }, [onChange])

  const plugins = exampleSetup({ schema })
    .concat(additionalPlugins)
    .concat((readOnly && readOnlyPlugin()) || [])
    .concat(contentUpdateHookPlugin(refOnChange))

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

export { useProseState, onChangeType }
