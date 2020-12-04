import * as React from 'react'
import { Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { useDefaultSchema } from '../schemas/defaultSchema'
import { useProseState } from '../hooks/useProseState'
import { useProseView } from '../hooks/useProseView'
import { readOnlyPlugin } from '../plugins/readOnlyPlugin'

export type ProseViewProps = {
  id: string
  label: string
  initialValue?: { [key: string]: any } // toJSON extract of a prosemirror Node.
  schema?: Schema
  readOnly?: boolean
  state?: EditorState
}

const ProseView = React.forwardRef<EditorView, ProseViewProps>(
  function ProseView(props, ref) {
    const {
      id,
      initialValue,
      state: stateFromProps,
      readOnly,
      ...restProps
    } = props

    const defaultSchema = useDefaultSchema()
    const schema = props.schema || defaultSchema

    const { editorState: defaultEditorState } = useProseState({
      initialValue,
      schema
    })

    // use either the default state or the one passed through props.
    const editorState = stateFromProps || defaultEditorState

    // create a cloned state if the readOnly prop is passed.
    // This is useful to have multiple controlled components sharing state,
    // while the read-only-plugin can be set differently for each component.
    const editorStateWithReadOnlyOption =
      editorState && readOnly
        ? editorState.reconfigure({
            plugins: editorState.plugins.concat(readOnlyPlugin())
          })
        : editorState

    const contentEditableDom = useProseView(
      editorStateWithReadOnlyOption,
      ref as React.MutableRefObject<EditorView>
    )

    // Note: In the below line, contentEditableDom is set as ref of the div
    // and this has nothing to do with the "ref" forwarded from the parent.
    return <div id={id} ref={contentEditableDom} {...restProps}></div>
  }
)

export default ProseView
