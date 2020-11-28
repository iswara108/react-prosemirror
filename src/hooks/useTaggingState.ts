import { Schema } from 'prosemirror-model'
import { useProseState, onChangeType } from '../hooks/useProseState'
import createImmutablePlugin from '../plugins/immutableNodePlugin'
import potentialTagsPlugin from '../plugins/potentialTagPlugin'

function useTaggingState(
  onChange: onChangeType,
  schema: Schema,
  readOnly: boolean
) {
  const additionalPlugins = [
    createImmutablePlugin(['hashtag', 'mention']),
    potentialTagsPlugin
  ]

  return useProseState(onChange, schema, readOnly, additionalPlugins)
}

export default useTaggingState
