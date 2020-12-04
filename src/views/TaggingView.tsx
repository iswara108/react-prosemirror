import * as React from 'react'
import styled from 'styled-components'

import { EditorView } from 'prosemirror-view'
import { useTaggingSchema } from '../schemas/taggingSchema'
import { useProseView } from '../hooks/useProseView'
import { useTaggingState } from '../hooks/useTaggingState'
import { Suggestions } from './Suggestions'
import { ProseViewProps } from './ProseView'

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

export type TaggingViewProps = ProseViewProps & {
  hashtags?: string[]
}

const TaggingView = React.forwardRef<EditorView, TaggingViewProps>(
  function TaggingView(props, ref) {
    const { id, initialValue, readOnly, hashtags, ...restProps } = props

    const defaultTaggingSchema = useTaggingSchema()
    const schema = props.schema || defaultTaggingSchema

    // // create a cloned state if the readOnly prop is passed.
    // // This is useful to have multiple controlled components sharing state,
    // // while the read-only-plugin can be set differently for each component.
    // const stateWithPerservedReadOnlyStatus =
    //   state && readOnly
    //     ? state.reconfigure({
    //         plugins: state.plugins.concat(readOnlyPlugin())
    //       })
    //     : state

    const { taggingState, suggestionDispatch } = useTaggingState({
      initialValue,
      schema,
      hashtags
    })

    const contentEditableDom = useProseView(
      taggingState.editorState,
      ref as React.MutableRefObject<EditorView>
    )

    // Note: In the below line, contentEditableDom is set as ref of the div
    // and this has nothing to do with the "ref" forwarded from the parent.
    return (
      <>
        <button
          onClick={() =>
            suggestionDispatch({ type: 'resolve tag', payload: 'hello' })
          }
        >
          Resolve text into prosemirror
        </button>
        <StyledDiv id={id} ref={contentEditableDom} {...restProps}></StyledDiv>
        {taggingState.suggestions?.hashtagSuggestions && (
          <Suggestions
            suggestionState={taggingState.suggestions}
            suggestionDispatch={suggestionDispatch}
          />
        )}
      </>
    )
  }
)

export default TaggingView
