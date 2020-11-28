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
  // // create a sync plugin which calls a callback prop whenever the view changes.
  // // pass ref callback which is updated when the onChange prop is renewed.
  // const refStateChange = React.useRef<onChangeType>(callback)

  // // update refOnChange's current value to the onChange callback.
  // // the refOnChange object is passed by reference to the sync plugin during initialization
  // React.useEffect(() => {
  //   refStateChange.current = callback
  // }, [callback])

  // const additionalPlugins = [
  //   createImmutablePlugin(['hashtag', 'mention']),
  //   potentialTagsPlugin,
  //   stateUpdateHookPlugin(refStateChange)
  // ]

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

// const callback: onChangeType = jsonNode => {
//   console.log('callback', JSON.stringify(jsonNode))
// }

const callback = (jsonNode: { [key: string]: any }) => {
  console.log('callback', JSON.stringify(jsonNode))
}

export { useTaggingState as default, onChangeType }
