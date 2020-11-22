import * as React from 'react'
import { EditorView } from 'prosemirror-view'
import 'prosemirror-view/style/prosemirror.css'
import styled from 'styled-components'
import { Node, Schema } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { useTaggingSchema } from '../schemas/taggingSchema'
import { onChangeType } from '../plugins/syncStatePlugin'
import { readOnlyPlugin } from '../plugins/readOnlyPlugin'
import { useControlled } from '../hooks/controlled'
import useRefEditorView from '../hooks/EditorViewRef'

const StyledDiv = styled.div`
  .editing-hashtag {
    background: #fffaea;
    border-bottom: 1px solid #f22;
    margin-bottom: -1px;
  }

  .editing-mention {
    background: #f0faff;
    border-bottom: 1px solid rgb(81, 248, 156);
    margin-bottom: -1px;
  }

  .ProseMirror-selectednode {
    background: #fcb;
  }

  hashtag {
    color: saddlebrown;
    /* margin-bottom: -1px; */
  }

  mention {
    color: dodgerblue;
  }

  .ProseMirror {
    padding-right: 20px;
  }
`

export type TaggingViewProps = {
  id: string
  label: string
  value?: { [key: string]: any } | null
  onChange?: onChangeType
  schema?: Schema
  readOnly?: boolean
}

const TaggingView = React.forwardRef<EditorView, TaggingViewProps>(
  function TaggingView(props, ref) {
    const { id, value, onChange, readOnly, ...restProps } = props
    const [view, setView] = React.useState<EditorView>()
    const contentEditableDom = React.useRef(document.createElement('div'))
    const defaultTaggingSchema = useTaggingSchema()
    const schema = props.schema || defaultTaggingSchema

    const syncStatePlugin = useControlled(value, onChange, view, schema)
    useRefEditorView(ref as React.MutableRefObject<EditorView>, view)

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

    // Note: In the below line, contentEditableDom is set as ref of the div
    // and this has nothing to do with the "ref" forwarded from the parent.
    return (
      <StyledDiv id={id} ref={contentEditableDom} {...restProps}></StyledDiv>
    )
  }
)

export function createEmptyDocument(schema: Schema) {
  return Node.fromJSON<Schema>(schema, {
    type: 'doc',
    content: [{ type: 'paragraph' }]
  })
}

export default TaggingView
