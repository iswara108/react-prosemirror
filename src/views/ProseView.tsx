import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { Node, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { useDefaultSchema } from '../schemas/defaultSchema'
import { onChangeType, useSyncPlugin } from '../plugins/syncStatePlugin'
import { readOnlyPlugin } from '../plugins/readOnlyPlugin'
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

  // hook to create a plugin which enables the component to be
  // a "Controlled Component". It is only active if
  // props "value" and "onChange" are supplied to the component.

  // create a sync plugin which calls a callback prop whenever the view changes.
  // pass ref callback which is updated when the onChange prop is renewed.
  const refOnChange = React.useRef((val: { [key: string]: any }) =>
    onChange?.(val)
  )
  const syncStatePlugin = useSyncPlugin(refOnChange)

  // update refOnChange's current value to the onChange callback.
  // the refOnChange object is passed by reference to the sync plugin during initialization
  React.useEffect(() => {
    refOnChange.current = (val: { [key: string]: any }) => onChange?.(val)
  }, [onChange])

  // refresh the view with a new state whenever the value prop changes
  React.useLayoutEffect(() => {
    if (value) {
      const valueNode = Node.fromJSON(schema, value)
      if (!view?.state.doc.eq(valueNode)) {
        try {
          // todo: change to apply transaction and replace the contents (instead of recreating the whole state)
          view?.updateState(
            EditorState.create({
              schema: view.state.schema,
              doc: valueNode,
              plugins: view.state.plugins
            })
          )
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [value, view, schema])

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
