import * as React from 'react'
import ProseView, { ProseViewProps } from './views/ProseView'
import { EditorView } from 'prosemirror-view'

const ProseMirror = React.forwardRef<EditorView, ProseViewProps>(
  function ProseMirror(props, ref) {
    return <ProseView {...props} ref={ref} />
  }
)

export default ProseMirror
