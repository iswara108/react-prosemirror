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

      <ReactProseMirror
        id="prosemirror-disable-edit"
        label=""
        disableEdit
        value={`
        {
          "type": "doc",
          "content": [
            {
              "type": "paragraph",
              "content": [
                {
                  "type": "text",
                  "text": "I "
                },
                {
                  "type": "text",
                  "marks": [
                    {
                      "type": "strong"
                    }
                  ],
                  "text": "cannot"
                },
                {
                  "type": "text",
                  "text": " be changed"
                }
              ]
            }
          ]
        }`}
      />

      <ControlledMirros />
    </>
  )
}

function ControlledMirros() {
  const [value, setValue] = React.useState<string | null>(null)
  const schema = useDefaultSchema()
  React.useEffect(
    () => console.log("controlled mirrored components' value changed: ", value),
    [value]
  )

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
      <ReactProseMirror
        id="prosemirror-controlled-3"
        label="controlled-component"
        value={value}
        schema={schema}
        disableEdit
      />
    </>
  )
}

export default App
