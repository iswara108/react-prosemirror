import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import { ProseMirror, TaggingEditor } from '../src'
import { useDefaultSchema } from '../src/schemas/defaultSchema'
import {
  taggingDemoContent,
  unchangedTextDemoContent
} from './lib/demoInitialContents'
import { EditorView } from 'prosemirror-view'
import applyDevTools from 'prosemirror-dev-tools'

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

  const [value, setValue] = React.useState<{ [key: string]: any } | null>(
    taggingDemoContent
  )

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
        readOnly
        value={unchangedTextDemoContent}
      />

      <ControlledMirros />
      <ComponentWithRef />
      <TaggingEditor
        id="prosemirror-tagging-editor"
        label=""
        value={value}
        onChange={setValue}
        ref={tagRef}
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
  const [value, setValue] = React.useState<{ [key: string]: any } | null>(null)
  const schema = useDefaultSchema()
  React.useEffect(
    () => console.log("controlled mirrored components' value changed: ", value),
    [value]
  )

  return (
    <>
      <ProseMirror
        id="prosemirror-controlled-1"
        label="controlled-component"
        value={value}
        schema={schema}
        onChange={setValue}
      />
      <ProseMirror
        id="prosemirror-controlled-2"
        label="controlled-component"
        value={value}
        schema={schema}
        onChange={setValue}
      />
      <ProseMirror
        id="prosemirror-controlled-3"
        label="controlled-component"
        value={value}
        schema={schema}
        readOnly
      />
    </>
  )
}

export default App
