import * as React from 'react'
import { Node, Schema } from 'prosemirror-model'
import { EditorState, Plugin } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { contentUpdateHookPlugin } from '../plugins/contentUpdateHookPlugin'

// create a plugin to fire the onChange event whenever the editorState changes,
// a read only plugin to deactivate any transaction, and create the editorState.
function useProseState({
  schema,
  initialValue,
  additionalPlugins = []
}: {
  schema: Schema
  initialValue?: { [key: string]: any }
  additionalPlugins?: Plugin[]
}): {
  editorState: EditorState
  setEditorState: (newState: EditorState) => void
} {
  const updateMe = {
    update(newState: EditorState) {
      setEditorState(newState)
    }
  }

  const doc = initialValue
    ? Node.fromJSON(schema, initialValue)
    : createEmptyDocument(schema)

  const plugins = exampleSetup({ schema })
    .concat(additionalPlugins)
    .concat(contentUpdateHookPlugin(updateMe))

  const initialState = EditorState.create({ schema, doc, plugins })

  const [editorState, setEditorState] = React.useState(initialState)
  return { editorState, setEditorState }
}

// default empty document
function createEmptyDocument(schema: Schema) {
  return Node.fromJSON<Schema>(schema, {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
}

export { useProseState }
