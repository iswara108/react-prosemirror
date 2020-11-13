import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import ReactProseMirror, { createSchema, emptyDefaultDocument } from '../src'

function ControlledMirros() {
  const [value, setValue] = React.useState<string | null>(null)

  const onChange = (newDocument: string) => {
    if (newDocument !== value) {
      console.log(
        'setting value from controlled 1 or 2 ',
        newDocument,
        'value is ',
        value
      )
      setValue(newDocument)
    }
  }
  React.useEffect(() => console.log('outside value changed to ', value), [
    value
  ])

  return (
    <>
      <ReactProseMirror
        id="prosemirror-controlled-1"
        label="controlled-component"
        value={value}
        onChange={onChange}
      />
      <ReactProseMirror
        id="prosemirror-controlled-2"
        label="controlled-component"
        value={value}
        onChange={onChange}
      />
    </>
  )
}

function App() {
  return (
    <>
      <ReactProseMirror id="prosemirror-multiline" label="" multiline />
      <ReactProseMirror id="prosemirror-singleline" label="" />
      <ControlledMirros />
    </>
  )
}

export default App
