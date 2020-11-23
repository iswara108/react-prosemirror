import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'
import { useDefaultSchema } from '../schemas/defaultSchema'
import { useProseState, onChangeType } from '../hooks/useProseState'
import { useProseView } from '../hooks/useProseView'

export type ProseViewProps = {
  id: string
  label: string
  value?: { [key: string]: any } | null
  onChange?: onChangeType
  schema?: Schema
  readOnly?: boolean
}

const ProseView = React.forwardRef<EditorView, ProseViewProps>(
  function ProseView(props, ref) {
    const { id, value, onChange, readOnly, ...restProps } = props

    const defaultSchema = useDefaultSchema()
    const schema = props.schema || defaultSchema

    const editorState = useProseState(onChange, schema, !!readOnly)

    const contentEditableDom = useProseView(
      value,
      editorState,
      ref as React.MutableRefObject<EditorView>
    )

    // Note: In the below line, contentEditableDom is set as ref of the div
    // and this has nothing to do with the "ref" forwarded from the parent.
    return <div id={id} ref={contentEditableDom} {...restProps}></div>
  }
)

export default ProseView
