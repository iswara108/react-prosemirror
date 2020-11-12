import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { Node, Schema } from 'prosemirror-model'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

type onChangeType = (stringifiedNode: string) => void
export type ProseViewProps = {
  id: string
  label: string
  multiline?: boolean
  value?: string | null
  onChange?: onChangeType
}

export function emptyDefaultDocument(schema: Schema) {
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

const useSyncPlugin = (onChange: undefined | onChangeType) =>
  onChange
    ? new Plugin({
        key: new PluginKey('Sync State Plugin'),
        view: () => ({
          update: view => onChange(JSON.stringify(view.state.doc))
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
  const contentEditableDom = React.useRef(document.createElement('div'))

  const syncStatePlugin = useSyncPlugin(onChange)

  const [view, setView] = React.useState<EditorView>()

  React.useLayoutEffect(() => {
    if (value && value !== JSON.stringify(view?.state.doc)) {
      console.log('changed value to ', value?.toString())
      view?.updateState(
        EditorState.create({
          schema: view.state.schema,
          doc: Node.fromJSON(schemaBasic!, JSON.parse(value)),
          plugins: view.state.plugins
        })
      )
    }
  }, [value, view])

  // initialize view with state
  React.useLayoutEffect(() => {
    console.log('aaa')
    if (!view) {
      setView(
        new EditorView(contentEditableDom.current, {
          state: EditorState.create({
            schema: schemaBasic,
            doc: emptyDefaultDocument(schemaBasic),
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

export default ProseView

// editorView has editorState inside.
// When editorView changes, its editorState changes accordingly, through props this bubbles up to parent.
// When the parent value changes, the view gets a new editorState with view.updateState

// this is inefficient but it's the only thing i can find...
