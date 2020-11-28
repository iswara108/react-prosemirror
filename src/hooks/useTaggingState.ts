import * as React from 'react'
import { Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
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

function useTaggingState(
  onChange: onChangeType,
  schema: Schema,
  readOnly: boolean,
  hashtags?: string[]
): { editorState: EditorState; suggestionState: SuggestionStateType } {
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
          hashtagSuggestions: hashtags?.filter(h => h.includes(action.payload))
        }
      case 'close tag suggestions':
        return {}
      default:
        throw new Error()
    }
  }

  const [suggestionState, dispatchSuggestion] = React.useReducer(
    suggestionReducer,
    initialSuggestionState
  )

  function updateTagSuggestions(editorState: EditorState): void {
    const potentialHashtag = findEditingHashtag(
      editorState.doc,
      editorState.selection
    )

    if (potentialHashtag) {
      dispatchSuggestion({
        type: 'open tag suggestions',
        payload: potentialHashtag.value
      })
    } else {
      dispatchSuggestion({ type: 'close tag suggestions' })
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

  return { editorState, suggestionState }
}

export { useTaggingState as default, onChangeType }
