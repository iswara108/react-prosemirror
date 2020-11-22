import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { Node, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { useDefaultSchema } from '../schemas/defaultSchema'
import { onChangeType } from '../plugins/syncStatePlugin'
import { readOnlyPlugin } from '../plugins/readOnlyPlugin'
import { useControlled } from '../hooks/controlled'
import useRefEditorView from '../hooks/EditorViewRef'

export type ProseViewProps = {
  id: string
  label: string
  value?: { [key: string]: any } | null
  onChange?: onChangeType
  schema?: Schema
  readOnly?: boolean
}

function useProseView(
  value: { [key: string]: any } | null | undefined,
  onChange: onChangeType,
  schema: Schema,
  ref: React.MutableRefObject<EditorView>,
  readOnly: boolean
) {
  const [view, setView] = React.useState<EditorView>()
  const contentEditableDom = React.useRef(document.createElement('div'))

  const syncStatePlugin = useControlled(value, onChange, view, schema)
  useRefEditorView(ref, view)

  // initialize view with state
  React.useLayoutEffect(() => {
    if (!view) {
      const doc = createEmptyDocument(schema)
      const plugins = exampleSetup({ schema: schema })
        .concat((readOnly && readOnlyPlugin()) || [])
        .concat(syncStatePlugin)

      setView(
        new EditorView(contentEditableDom.current, {
          state: EditorState.create({ schema, doc, plugins })
        })
      )
    }
  }, [view, syncStatePlugin, schema, readOnly])

  return contentEditableDom
}

const ProseView = React.forwardRef<EditorView, ProseViewProps>(
  function ProseView(props, ref) {
    const { id, value, onChange, readOnly, ...restProps } = props
    const defaultSchema = useDefaultSchema()
    const schema = props.schema || defaultSchema
    const contentEditableDom = useProseView(
      value,
      onChange,
      schema,
      ref as React.MutableRefObject<EditorView>,
      !!readOnly
    )
    // Note: In the below line, contentEditableDom is set as ref of the div
    // and this has nothing to do with the "ref" forwarded from the parent.
    return <div id={id} ref={contentEditableDom} {...restProps}></div>
  }
)

export function createEmptyDocument(schema: Schema) {
  return Node.fromJSON<Schema>(schema, {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
}

export default ProseView
