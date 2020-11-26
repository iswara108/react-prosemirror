import { Schema } from 'prosemirror-model'
import { useProseState, onChangeType } from '../hooks/useProseState'
import createImmutablePlugin from '../plugins/immutableNodePlugin'
import hashtagPlugin from '../plugins/tagsUnderConstructionPlugin'

function useTaggingState(
  onChange: onChangeType,
  schema: Schema,
  readOnly: boolean
) {
  const additionalPlugins = [
    createImmutablePlugin(['hashtag', 'mention']),
    hashtagPlugin
  ]

  return useProseState(onChange, schema, readOnly, additionalPlugins)
}

export default useTaggingState
