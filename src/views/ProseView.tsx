import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import { Node, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import usePrevious from 'use-previous'
import { useSyncPlugin, onChangeType } from '../plugins/syncStatePlugin'

export type ProseViewProps = {
  id: string
  label: string
  multiline?: boolean
  disableMarks?: boolean
  value?: string | null
  onChange?: onChangeType
}

const ProseView = ({
  id,
  multiline = false,
  value,
  onChange,
  disableMarks = false,
  ...restProps
}: ProseViewProps) => {
  const [view, setView] = React.useState<EditorView>()
  const contentEditableDom = React.useRef(document.createElement('div'))
  const syncStatePlugin = useSyncPlugin(onChange)
  const previousValue = usePrevious(value)

  const schema = createSchema({ multiline, disableMarks })

  // initialize view with state
  React.useLayoutEffect(() => {
    if (!view) {
      setView(
        new EditorView(contentEditableDom.current, {
          state: EditorState.create({
            schema: schema,
            doc: createEmptyDocument(schema),
            plugins: exampleSetup({ schema: schema }).concat(
              syncStatePlugin || []
            )
          })
        })
      )
    }
  }, [view, syncStatePlugin, schema])

  // refresh the view with a new state whenever the value prop changes
  React.useLayoutEffect(() => {
    if (value && value !== JSON.stringify(view?.state.doc)) {
      try {
        const doc = Node.fromJSON(schema, JSON.parse(value))
        // doc.check()

        view?.updateState(
          EditorState.create({
            schema: view.state.schema,
            doc,
            plugins: view.state.plugins
              .slice(0, -1)
              .concat(syncStatePlugin || [])
          })
        )
      } catch (e) {
        console.error(e)
      }
    }
  }, [value, view, syncStatePlugin, schema])

  // refresh the syncStatePlugin whenever the value changes
  React.useLayoutEffect(() => {
    if (value && value !== previousValue)
      view?.state.reconfigure({
        plugins: view.state.plugins.slice(0, -1).concat(syncStatePlugin || [])
      })
  }, [value, syncStatePlugin, previousValue, view])

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
