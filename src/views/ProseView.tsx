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

export type ProseViewProps = {
  id: string
  label: string
  value?: string | null
  onChange?: onChangeType
  schema?: Schema
  disableEdit?: boolean
}

const ProseView = React.forwardRef(function ProseView(
  props: ProseViewProps,
  ref
) {
  const { id, value, onChange, disableEdit, ...restProps } = props
  const [view, setView] = React.useState<EditorView>()
  const contentEditableDom = React.useRef(document.createElement('div'))
  const defaultSchema = useDefaultSchema()
  const schema = props.schema || defaultSchema

  const syncStatePlugin = useControlled(value, onChange, view, schema)

  // initialize view with state
  React.useLayoutEffect(() => {
    if (!view) {
      const doc = createEmptyDocument(schema)
      const plugins = exampleSetup({ schema: schema })
        .concat((disableEdit && readOnlyPlugin()) || [])
        .concat(syncStatePlugin)

      setView(
        new EditorView(contentEditableDom.current, {
          state: EditorState.create({ schema, doc, plugins })
        })
      )
    }
  }, [view, syncStatePlugin, schema, disableEdit])

  // set the ref object to the prosemirror editorView
  React.useEffect(() => {
    if (view && ref) {
      ;(ref as React.MutableRefObject<EditorView>).current = view
    }
  }, [view, ref])
  return <div id={id} ref={contentEditableDom} {...restProps}></div>
})

export function createEmptyDocument(schema: Schema) {
  return Node.fromJSON<Schema>(schema, {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
}

export default ProseView
