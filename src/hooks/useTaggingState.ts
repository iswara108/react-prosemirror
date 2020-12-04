import * as React from 'react'
import { Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import deburr from 'lodash/deburr'
import { useProseState } from '../hooks/useProseState'
import createImmutablePlugin from '../plugins/immutableNodePlugin'
import potentialTagsPlugin from '../plugins/potentialTagPlugin'
import { stateUpdateHookPlugin } from '../plugins/stateUpdateHookPlugin'
import { findEditingHashtag } from '../textUtils/tagUtils'

export type SuggestionStateType = {
  potentialTag?: string
  hashtagSuggestions?: string[]
}

export type TaggingStateType = {
  editorState: EditorState
  suggestions?: SuggestionStateType
}

export type SuggestionActionType =
  | { type: 'open tag suggestions'; payload: string }
  | { type: 'next suggestions' }
  | { type: 'previous suggestions' }
  | { type: 'set suggestion'; payload: number }
  | { type: 'close tag suggestions' }
  | { type: 'resolve tag'; payload: string }
  | { type: 'update state'; payload: EditorState }

function useTaggingState({
  editorState: initializedState,
  initialValue,
  schema,
  hashtags
}: {
  editorState?: EditorState
  initialValue: { [key: string]: any } | undefined
  schema: Schema
  hashtags?: string[]
}): {
  taggingState: TaggingStateType
  suggestionDispatch: React.Dispatch<SuggestionActionType>
} {
  const additionalPlugins = [
    createImmutablePlugin(['hashtag', 'mention']),
    potentialTagsPlugin,
    stateUpdateHookPlugin(onEditorStateChange)
  ]

  const { editorState } = useProseState({
    initialValue,
    schema,
    additionalPlugins
  })

  const initialSuggestionState = {
    editorState: initializedState || editorState
  }
  function suggestionReducer(
    state: TaggingStateType,
    action: SuggestionActionType
  ): TaggingStateType {
    switch (action.type) {
      case 'update state':
        return { editorState: action.payload }
      case 'open tag suggestions':
        console.log(
          'opening suggestions',
          getRelevantSuggestions(action.payload, hashtags)
        )
        return {
          ...state,
          suggestions: {
            potentialTag: action.payload,
            hashtagSuggestions: getRelevantSuggestions(action.payload, hashtags)
          }
        }
      case 'close tag suggestions':
        return { editorState: state.editorState }
      case 'resolve tag':
        console.log('resolved to ', action.payload)
        console.log('selection ', JSON.stringify(state.editorState.selection))
        const newState = EditorState.create({
          doc: state.editorState.doc,
          selection: state.editorState.selection,
          plugins: state.editorState.plugins
        })
        const tr = newState.tr
        tr.insertText(
          action.payload,
          newState.selection.from,
          newState.selection.to
        )
        const newStateWithTag = newState.apply(tr)
        return { editorState: newStateWithTag }
      default:
        throw new Error('case of ' + action.type + ' is not implemented')
    }
  }

  const [taggingState, suggestionDispatch] = React.useReducer(
    suggestionReducer,
    initialSuggestionState
  )

  function onEditorStateChange(editorState: EditorState): void {
    suggestionDispatch({ type: 'update state', payload: editorState })
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

  return { taggingState, suggestionDispatch }
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
export { useTaggingState }
