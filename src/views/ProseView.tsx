import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { Node, Schema } from 'prosemirror-model'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

export type ProseViewProps = {
  id: string
  label: string
  multiline?: boolean
  value?: string | null
  onChange?: (newValue: string) => void
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

const ProseView = ({
  id,
  multiline = false,
  value,
  onChange,
  ...restProps
}: ProseViewProps) => {
  const contentEditableDom = React.useRef(document.createElement('div'))
  const disableMarks = false
  console.log(multiline, disableMarks)
  console.log('running code again')

  const syncStatePlugin = new Plugin({
    key: new PluginKey('Sync State Plugin'),
    view: () => ({
      update: view => {
        // if (JSON.stringify(view.state) !== JSON.stringify(editorState)) {
        onChange?.(JSON.stringify(view.state.doc))
        // }
      }
    })
  })
  const examplePlugins = [
    ...exampleSetup({ schema: schemaBasic }),
    syncStatePlugin
  ]

  const [view, setView] = React.useState<EditorView>()

  React.useEffect(() => {
    console.log('changed value to ', value?.toString())
    if (value)
      view?.update({
        state: EditorState.create({
          schema: view.state.schema,
          doc: Node.fromJSON(schemaBasic!, JSON.parse(value)),
          plugins: view.state.plugins
        })
      })
  }, [value])

  // initialize view with state
  React.useEffect(() => {
    console.log('aaa')
    if (!view) {
      setView(
        new EditorView(contentEditableDom.current, {
          state: EditorState.create({
            schema: schemaBasic,
            doc: emptyDefaultDocument(schemaBasic),
            plugins: examplePlugins
          })
        })
      )
      ;(window as any).view = view
    }
  }, [view])

  React.useLayoutEffect(() => {
    console.log('state changed')
  }, [view, view?.state, JSON.stringify(view?.state)])
  React.useEffect(() => {
    ;(window as any).view2 = view
  }, [view])

  return <div id={id} ref={contentEditableDom} {...restProps}></div>
}

export default ProseView

// editorView has editorState inside.
// When editorView changes, its editorState changes accordingly, through props this bubbles up to parent.
// When the parent value changes, the view gets a new editorState with view.updateState

// this is inefficient but it's the only thing i can find...
