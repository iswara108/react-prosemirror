import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import ReactProseMirror, { createSchema, createEmptyDocument } from '../src'

function App() {
  return (
    <>
      <ReactProseMirror id="prosemirror-multiline" label="" multiline />
      <ReactProseMirror id="prosemirror-singleline" label="" />
      <ReactProseMirror
        id="prosemirror-no-marks-multiline"
        label=""
        disableMarks
        multiline
      />
      <ControlledMirros />
    </>
  )
}

function ControlledMirros() {
  const [value, setValue] = React.useState<string | null>(null)

  return (
    <>
      <ReactProseMirror
        id="prosemirror-controlled-1"
        label="controlled-component"
        value={value}
        onChange={setValue}
      />
      <ReactProseMirror
        id="prosemirror-controlled-2"
        label="controlled-component"
        value={value}
        onChange={setValue}
      />
    </>
  )
}

export default App
