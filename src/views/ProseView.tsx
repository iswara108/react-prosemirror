import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { Node, Schema } from 'prosemirror-model'
import { EditorState, Plugin, PluginKey } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import usePrevious from 'use-previous'

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

function counting(onChange: undefined | onChangeType, i: number) {
  return onChange
    ? new Plugin<{ value: string }>({
        key: new PluginKey('Sync State Plugin ' + i.toString()),
        view: () => ({
          update: (view, prevState) => {
            console.log('in update')
            if (!prevState.doc.eq(view.state.doc)) {
              console.log('really updating')
              onChange(JSON.stringify(view.state.doc))
            }
          }
        })
      })
    : undefined
}
let i = 0
// this plugin needs to be the last one defined, to capture the last state on a sequence of plugin intervention
const useSyncPlugin = (onChange: undefined | onChangeType) =>
  counting(onChange, i++)

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
  const previousValue = usePrevious(value)

  React.useLayoutEffect(() => {
    if (value && value !== JSON.stringify(view?.state.doc)) {
      console.log('changed value to ', value?.toString())
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
    console.log('value', value, 'prev', previousValue)
    if (value && value !== previousValue)
      view?.state.reconfigure({
        plugins: view.state.plugins.slice(0, -1).concat(syncStatePlugin || [])
      })
  }, [value, syncStatePlugin, previousValue, view])

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

  React.useEffect(() => {
    if (view) (window as any).view = view
  }, [view])
  return <div id={id} ref={contentEditableDom} {...restProps}></div>
}

export default ProseView

// editorView has editorState inside.
// When editorView changes, its editorState changes accordingly, through props this bubbles up to parent.
// When the parent value changes, the view gets a new editorState with view.updateState

// this is inefficient but it's the only thing i can find...
