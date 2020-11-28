import * as React from 'react'
import { Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import deburr from 'lodash/deburr'
import { useProseState, onChangeType } from '../hooks/useProseState'
import createImmutablePlugin from '../plugins/immutableNodePlugin'
import potentialTagsPlugin from '../plugins/potentialTagPlugin'
import { stateUpdateHookPlugin } from '../plugins/staeUpdateHookPlugin'
import { findEditingHashtag } from '../textUtils/tagUtils'

export type SuggestionStateType = {
  potentialTag?: string
  hashtagSuggestions?: string[]
}

export type SuggestionActionType =
  | { type: 'open tag suggestions'; payload: string }
  | { type: 'next suggestions' }
  | { type: 'previous suggestions' }
  | { type: 'set suggestion'; payload: number }
  | { type: 'close tag suggestions' }
  | { type: 'resolve tag'; payload: string }

function useTaggingState(
  onChange: onChangeType,
  schema: Schema,
  readOnly: boolean,
  hashtags?: string[]
): {
  editorState: EditorState
  suggestionState: SuggestionStateType
  suggestionDispatch: React.Dispatch<SuggestionActionType>
} {
  const initialSuggestionState = {}

  function suggestionReducer(
    state: SuggestionStateType,
    action: SuggestionActionType
  ): SuggestionStateType {
    switch (action.type) {
      case 'open tag suggestions':
        return {
          ...state,
          potentialTag: action.payload,
          hashtagSuggestions: getRelevantSuggestions(action.payload, hashtags)
        }
      case 'close tag suggestions':
        return {}
      case 'resolve tag':
        console.log('resolved to ', action.payload)
        return {}
      default:
        throw new Error('case of ' + action.type + ' is not implemented')
    }
  }

  const [suggestionState, suggestionDispatch] = React.useReducer(
    suggestionReducer,
    initialSuggestionState
  )

  function updateTagSuggestions(editorState: EditorState): void {
    const potentialHashtag = findEditingHashtag(
      editorState.doc,
      editorState.selection
    )

    if (potentialHashtag) {
      suggestionDispatch({
        type: 'open tag suggestions',
        payload: potentialHashtag.value
      })
    } else {
      suggestionDispatch({ type: 'close tag suggestions' })
    }
  }

  const additionalPlugins = [
    createImmutablePlugin(['hashtag', 'mention']),
    potentialTagsPlugin,
    stateUpdateHookPlugin(updateTagSuggestions)
  ]

  const editorState = useProseState(
    onChange,
    schema,
    readOnly,
    additionalPlugins
  )

  return { editorState, suggestionState, suggestionDispatch }
}

// Get relevant suggestions for the given hashtag under construction.
function getRelevantSuggestions(
  value: string,
  hashtagSuggestions: string[] = []
) {
  const inputValue = deburr(value.trim()).toLowerCase()
  const inputLength = inputValue.length
  return inputLength === 0
    ? []
    : hashtagSuggestions.filter(
        suggestion =>
          suggestion.slice(0, inputLength).toLowerCase() === inputValue
      )
}
export { useTaggingState as default, onChangeType }
