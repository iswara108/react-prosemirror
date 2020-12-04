import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import {
  ProseMirror,
  useProseState,
  useTaggingState,
  TaggingEditor
} from '../src'

import { useDefaultSchema } from '../src/schemas/defaultSchema'
import {
  standardTextDemoContent,
  taggingDemoContent,
  unchangedTextDemoContent
} from './lib/demoInitialContents'
import { EditorView } from 'prosemirror-view'
import applyDevTools from 'prosemirror-dev-tools'
import { useTaggingSchema } from '../src/schemas/taggingSchema'

function App() {
  const singlelineSchema = useDefaultSchema({ multiline: false })
  const noMarksSchema = useDefaultSchema({ disableMarks: true })
  const tagRef = React.createRef<EditorView>()

  React.useEffect(() => {
    setTimeout(() => {
      if (tagRef.current) applyDevTools(tagRef.current)
      ;(window as Window & {
        tagView?: EditorView
      }).tagView = tagRef.current!
    }, 0)
  }, [])

  const unchangedTextDemo = useProseState({
    schema: singlelineSchema,
    initialValue: unchangedTextDemoContent
  })

  const defaultTaggingSchema = useTaggingSchema()

  const {
    taggingState: { editorState },
    suggestionDispatch
  } = useTaggingState({
    schema: defaultTaggingSchema,
    initialValue: taggingDemoContent
  })

  return (
    <>
      <ProseMirror id="prosemirror-multiline" label="" />
      <ProseMirror
        id="prosemirror-singleline"
        label=""
        schema={singlelineSchema}
      />
      <ProseMirror
        id="prosemirror-no-marks-multiline"
        label=""
        schema={noMarksSchema}
      />

      <ProseMirror
        id="prosemirror-disable-edit"
        label=""
        initialValue={unchangedTextDemoContent}
        readOnly
      />

      <ControlledMirros />
      <ComponentWithRef />
      <TaggingEditor
        id="prosemirror-tagging-editor"
        label=""
        initialValue={taggingDemoContent}
        ref={tagRef}
        state={editorState}
        hashtags={['#computer', '#office']}
      />
    </>
  )
}

function ComponentWithRef() {
  const editorViewRef = React.createRef<EditorView>()

  React.useEffect(() => {
    setTimeout(() => {
      ;(window as Window & {
        editorView?: EditorView
      }).editorView = editorViewRef.current!
    }, 0)
  }, [editorViewRef])

  return <ProseMirror id="prosemirror-ref" label="" ref={editorViewRef} />
}

function ControlledMirros() {
  const schema = useDefaultSchema()
  const { editorState, setEditorState } = useProseState({
    schema,
    initialValue: standardTextDemoContent
  })

  React.useEffect(
    () =>
      console.log(
        "controlled mirrored components' state changed: ",
        JSON.stringify(editorState.doc)
      ),
    [editorState]
  )
  console.log('set state', setEditorState)

  return (
    <>
      <ProseMirror
        id="prosemirror-controlled-1"
        label="controlled-component"
        state={editorState}
      />
      <ProseMirror
        id="prosemirror-controlled-2"
        label="controlled-component"
        state={editorState}
      />
      read only:
      <ProseMirror
        id="prosemirror-controlled-3"
        label="controlled-component"
        state={editorState}
        readOnly
      />
    </>
  )
}

export default App
