import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import ReactProseMirror, { createSchema, emptyDefaultDocument } from '../src'

// import { HASHTAG_SCHEMA_NODE_TYPE } from './components/tagging/model/taggingUtils';

function App() {
  // const [value, setValue] = React.useState(emptyDefaultDocument(schema))
  const [value, setValue] = React.useState<string | null>(null)
  const [anothervalue, setanotherValue] = React.useState<number>(0)
  React.useEffect(
    () => console.log('outside value changed to ', anothervalue),
    [anothervalue]
  )

  return (
    <>
      <ReactProseMirror id="prosemirror-multiline" label="" multiline />
      <ReactProseMirror id="prosemirror-singleline" label="" />
      <ReactProseMirror
        id="prosemirror-controlled-1"
        label="controlled-component"
        value={value}
        onChange={(newDocument: string) => {
          console.log('setting value from controlled 1 to', newDocument)
          setanotherValue(anothervalue + 1)
          setValue(newDocument)
        }}
      />
      <ReactProseMirror
        id="prosemirror-controlled-2"
        label="controlled-component"
        value={value}
        onChange={(newDocument: typeof value) => {
          console.log('setting value from controlled 2 ')
          setValue(newDocument)
        }}
      />
      <button onClick={() => setanotherValue(anothervalue + 10)}>aaa</button>{' '}
    </>
  )
}

export default App
