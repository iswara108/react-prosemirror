import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

export type ProseViewProps = {
  id: string
  label: string
  multiline?: boolean
}

const ProseView = ({ id, multiline = false }: ProseViewProps) => {
  const contentEditableDom = React.useRef(document.createElement('div'))

  const disableMarks = false
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

  const editorState = EditorState.create<typeof schema>({ schema })

  const [view, setView] = React.useState<EditorView>()

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
