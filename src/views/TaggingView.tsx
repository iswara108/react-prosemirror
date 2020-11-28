import * as React from 'react'
import styled from 'styled-components'

import { EditorView } from 'prosemirror-view'
import { Schema } from 'prosemirror-model'
import { useTaggingSchema } from '../schemas/taggingSchema'
import { onChangeType } from '../hooks/useProseState'
import { useProseView } from '../hooks/useProseView'
import useTaggingState from '../hooks/useTaggingState'
import { Suggestions } from './Suggestions'

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
  hashtags?: string[]
}

const TaggingView = React.forwardRef<EditorView, TaggingViewProps>(
  function TaggingView(props, ref) {
    const { id, value, onChange, readOnly, hashtags, ...restProps } = props

    const defaultTaggingSchema = useTaggingSchema()
    const schema = props.schema || defaultTaggingSchema

    const {
      editorState,
      suggestionState,
      suggestionDispatch
    } = useTaggingState(onChange, schema, !!readOnly, hashtags)

    const contentEditableDom = useProseView(
      value,
      editorState,
      ref as React.MutableRefObject<EditorView>
    )

    // Note: In the below line, contentEditableDom is set as ref of the div
    // and this has nothing to do with the "ref" forwarded from the parent.
    return (
      <>
        <StyledDiv id={id} ref={contentEditableDom} {...restProps}></StyledDiv>
        {suggestionState.hashtagSuggestions && (
          <Suggestions
            suggestionState={suggestionState}
            suggestionDispatch={suggestionDispatch}
          />
        )}
      </>
    )
  }
)

export default TaggingView
