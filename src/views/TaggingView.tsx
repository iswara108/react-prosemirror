import * as React from 'react'
import styled from 'styled-components'

import { EditorView } from 'prosemirror-view'
import { Node, Schema } from 'prosemirror-model'
import { useTaggingSchema } from '../schemas/taggingSchema'
import { useProseState, onChangeType } from '../hooks/useProseState'
import { useProseView } from '../hooks/useProseView'

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

    const defaultTaggingSchema = useTaggingSchema()
    const schema = props.schema || defaultTaggingSchema

    const editorState = useProseState(onChange, schema, !!readOnly)

    const contentEditableDom = useProseView(
      value,
      editorState,
      ref as React.MutableRefObject<EditorView>
    )

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
