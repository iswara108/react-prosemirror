import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { Node, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
export type ProseViewProps = {
  id: string
  label: string
  multiline?: boolean
}

const ProseView = ({ id, multiline = false }: ProseViewProps) => {
  const contentEditableDom = React.useRef(document.createElement('div'))
  const disableMarks = false
  console.log(multiline, disableMarks)
  console.log('running code again')

  const schema = new Schema({
    nodes: (schemaBasic.spec.nodes as any).update(
      'doc',
      multiline
        ? (schemaBasic.spec.nodes as any).get('doc')
        : { content: 'block' }
    ),
    marks: disableMarks ? undefined : schemaBasic.spec.marks
  })

  const examplePlugins = [...exampleSetup({ schema })]

  const [editorState] = React.useState(
    EditorState.create<typeof schema>({
      schema,
      doc: Node.fromJSON<typeof schema>(schema, {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Hi' }] }
        ]
      }),
      plugins: examplePlugins
    })
  )

  const [view, setView] = React.useState<EditorView>()

  // initialize view with state
  React.useEffect(() => {
    if (!view)
      setView(
        new EditorView(contentEditableDom.current, {
          state: editorState
        })
      )
  }, [view, editorState])

  React.useEffect(() => {
    ;(window as any).view = view
  }, [view])

  return <div id={id} ref={contentEditableDom}></div>
}

export default ProseView
