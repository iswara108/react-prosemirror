import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import ReactProseMirror from '../src'
import { useDefaultSchema } from '../src/schemas/defaultSchema'

function App() {
  const singlelineSchema = useDefaultSchema({ multiline: false })
  const noMarksSchema = useDefaultSchema({ disableMarks: true })

  return (
    <>
      <ReactProseMirror id="prosemirror-multiline" label="" />
      <ReactProseMirror
        id="prosemirror-singleline"
        label=""
        schema={singlelineSchema}
      />
      <ReactProseMirror
        id="prosemirror-no-marks-multiline"
        label=""
        schema={noMarksSchema}
      />
      <ControlledMirros />
    </>
  )
}

function ControlledMirros() {
  const [value, setValue] = React.useState<string | null>(null)
  const schema = useDefaultSchema()
  // const [schema] = React.useState(useDefaultSchema())

  React.useEffect(() => console.log('controlled schema changed'), [schema])
  return (
    <>
      <ReactProseMirror
        id="prosemirror-controlled-1"
        label="controlled-component"
        value={value}
        schema={schema}
        onChange={setValue}
        // multiline
      />
      <ReactProseMirror
        id="prosemirror-controlled-2"
        label="controlled-component"
        value={value}
        schema={schema}
        onChange={setValue}
        // multiline
      />
    </>
  )
}

export default App
