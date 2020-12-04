import * as React from 'react'
import ProseView, { ProseViewProps } from './views/ProseView'
import TaggingView, { TaggingViewProps } from './views/TaggingView'
import { EditorView } from 'prosemirror-view'
import { useProseState } from './hooks/useProseState'
import { useTaggingState } from './hooks/useTaggingState'

const ProseMirror = React.forwardRef<EditorView, ProseViewProps>(
  function ProseMirror(props, ref) {
    return <ProseView {...props} ref={ref} />
  }
)

const TaggingEditor = React.forwardRef<EditorView, TaggingViewProps>(
  function TaggingEditor(props, ref) {
    return <TaggingView {...props} ref={ref} />
  }
)

export { ProseMirror, TaggingEditor, useProseState, useTaggingState }
