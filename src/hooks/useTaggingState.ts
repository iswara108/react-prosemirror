import * as React from 'react'
import { Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { useProseState, onChangeType } from '../hooks/useProseState'
import createImmutablePlugin from '../plugins/immutableNodePlugin'
import potentialTagsPlugin from '../plugins/potentialTagPlugin'
import { stateUpdateHookPlugin } from '../plugins/staeUpdateHookPlugin'

function useTaggingState(
  onChange: onChangeType,
  schema: Schema,
  readOnly: boolean
): EditorState {
  const additionalPlugins = [
    createImmutablePlugin(['hashtag', 'mention']),
    potentialTagsPlugin,
    stateUpdateHookPlugin(callback)
  ]

  const editorState = useProseState(
    onChange,
    schema,
    readOnly,
    additionalPlugins
  )

  React.useEffect(() => {
    console.log('state changed', Math.random())
  })

  return editorState
}

const callback = (editorState: EditorState) => {
  console.log('callback', JSON.stringify(editorState))
}

export { useTaggingState as default, onChangeType }
