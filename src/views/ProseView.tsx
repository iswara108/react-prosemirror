import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { Node, Schema } from 'prosemirror-model'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import usePrevious from 'use-previous'

export type ProseViewProps = {
  id: string
  label: string
  multiline?: boolean
  value?: string | null
  onChange?: onChangeType
}

// controlled component's "onChange" prop type
export type onChangeType = (stringifiedNode: string) => void

// this plugin needs to be the last one defined, to capture the last state on a sequence of plugin intervention
const useSyncPlugin = (onChange: undefined | onChangeType) =>
  onChange
    ? new Plugin<{ value: string }>({
        key: new PluginKey('Sync State Plugin'),
        view: () => ({
          update: (view, prevState) => {
            if (!prevState.doc.eq(view.state.doc)) {
              onChange(JSON.stringify(view.state.doc))
            }
          }
        })
      })
    : undefined

const ProseView = ({
  id,
  multiline = false,
  value,
  onChange,
  ...restProps
}: ProseViewProps) => {
  const [view, setView] = React.useState<EditorView>()
  const contentEditableDom = React.useRef(document.createElement('div'))
  const syncStatePlugin = useSyncPlugin(onChange)
  const previousValue = usePrevious(value)

  React.useLayoutEffect(() => {
    if (value && value !== JSON.stringify(view?.state.doc)) {
      view?.updateState(
        EditorState.create({
          schema: view.state.schema,
          doc: Node.fromJSON(schemaBasic!, JSON.parse(value)),
          plugins: view.state.plugins.slice(0, -1).concat(syncStatePlugin || [])
        })
      )
    }
  }, [value, view, syncStatePlugin])

  React.useLayoutEffect(() => {
    if (value && value !== previousValue)
      view?.state.reconfigure({
        plugins: view.state.plugins.slice(0, -1).concat(syncStatePlugin || [])
      })
  }, [value, syncStatePlugin, previousValue, view])

  // initialize view with state
  React.useLayoutEffect(() => {
    if (!view) {
      setView(
        new EditorView(contentEditableDom.current, {
          state: EditorState.create({
            schema: schemaBasic,
            doc: createEmptyDocument(schemaBasic),
            plugins: exampleSetup({ schema: schemaBasic }).concat(
              syncStatePlugin || []
            )
          })
        })
      )
    }
  }, [view, syncStatePlugin])

  return <div id={id} ref={contentEditableDom} {...restProps}></div>
}

export function createEmptyDocument(schema: Schema) {
  return Node.fromJSON<Schema>(schema, {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
}

export function createSchema(
  options: { multiline: boolean; disableMarks: boolean } = {
    multiline: true,
    disableMarks: false
  }
): Schema {
  return new Schema({
    nodes: (schemaBasic.spec.nodes as any).update(
      'doc',
      options.multiline
        ? (schemaBasic.spec.nodes as any).get('doc')
        : { content: 'block' }
    ),
    marks: options.disableMarks ? undefined : schemaBasic.spec.marks
  })
}

export default ProseView
