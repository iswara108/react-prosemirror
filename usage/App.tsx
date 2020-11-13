import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import ReactProseMirror from '../src'
import { useDefaultSchema } from '../src/schemas/defaultSchema'

function App() {
  return (
    <>
      <ReactProseMirror id="prosemirror-multiline" label="" />
      <ReactProseMirror id="prosemirror-singleline" label="" />
      <ReactProseMirror id="prosemirror-no-marks-multiline" label="" />
      <ControlledMirros />
    </>
  )
}

function ControlledMirros() {
  const [value, setValue] = React.useState<string | null>(null)
  const schema = useDefaultSchema()

  return (
    <>
      <ReactProseMirror
        id="prosemirror-controlled-1"
        label="controlled-component"
        value={value}
        schema={schema}
        onChange={setValue}
      />
      <ReactProseMirror
        id="prosemirror-controlled-2"
        label="controlled-component"
        value={value}
        schema={schema}
        onChange={setValue}
      />
    </>
  )
}

export default App
