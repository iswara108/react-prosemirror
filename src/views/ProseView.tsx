import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { Node, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { useDefaultSchema } from '../schemas/defaultSchema'
import { useSyncPlugin, onChangeType } from '../plugins/syncStatePlugin'
import { readOnlyPlugin } from '../plugins/readOnlyPlugin'

export type ProseViewProps = {
  id: string
  label: string
  value?: string | null
  onChange?: onChangeType
  schema?: Schema
  disableEdit?: boolean
}

const ProseView = (props: ProseViewProps) => {
  const { id, value, onChange, disableEdit, ...restProps } = props
  const [view, setView] = React.useState<EditorView>()
  const contentEditableDom = React.useRef(document.createElement('div'))
  const defaultSchema = useDefaultSchema()
  const schema = props.schema || defaultSchema

  // create a sync plugin which calls a callback prop whenever the view changes.
  // pass ref callback which is updated when the onChange prop is renewed.
  const refOnChange = React.useRef((val: string) => onChange?.(val))
  const syncStatePlugin = useSyncPlugin(refOnChange)

  // update refOnChange's current value to the onChange callback.
  // the refOnChange object is passed by reference to the sync plugin during initialization
  React.useEffect(() => {
    refOnChange.current = (val: string) => onChange?.(val)
  }, [onChange])

  // initialize view with state
  React.useLayoutEffect(() => {
    if (!view) {
      setView(
        new EditorView(contentEditableDom.current, {
          state: EditorState.create({
            schema: schema,
            doc: createEmptyDocument(schema),
            plugins: exampleSetup({ schema: schema })
              .concat((disableEdit && readOnlyPlugin()) || [])
              .concat(syncStatePlugin)
          })
        })
      )
    }
  }, [view, syncStatePlugin, schema, disableEdit])

  // refresh the view with a new state whenever the value prop changes
  React.useLayoutEffect(() => {
    if (value && value !== JSON.stringify(view?.state.doc)) {
      try {
        // todo: change to apply transaction and replace the contents (instead of recreating the whole state)
        view?.updateState(
          EditorState.create({
            schema: view.state.schema,
            doc: Node.fromJSON(schema, JSON.parse(value)),
            plugins: view.state.plugins
          })
        )
      } catch (e) {
        console.error(e)
      }
    }
  }, [value, view, schema])

  return <div id={id} ref={contentEditableDom} {...restProps}></div>
}

export function createEmptyDocument(schema: Schema) {
  return Node.fromJSON<Schema>(schema, {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
}

export default ProseView
