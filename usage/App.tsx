import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import ReactProseMirror, { createSchema, emptyDefaultDocument } from '../src'

// import { HASHTAG_SCHEMA_NODE_TYPE } from './components/tagging/model/taggingUtils';

function App() {
  // const [value, setValue] = React.useState(emptyDefaultDocument(schema))
  const [value, setValue] = React.useState<string | null>(null)
  const [anothervalue, setanotherValue] = React.useState<number>(0)
  React.useEffect(() => console.log('outside value changed to ', value), [
    value
  ])
  const onChange = React.useCallback(
    (newDocument: string) => {
      if (newDocument !== value) {
        console.log(
          'setting value from controlled 1 or 2 ',
          newDocument,
          'value is ',
          value
        )
        setValue(newDocument)
      }
    },
    [value]
  )

  return (
    <>
      <ReactProseMirror id="prosemirror-multiline" label="" multiline />
      <ReactProseMirror id="prosemirror-singleline" label="" />
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
      <button onClick={() => setanotherValue(anothervalue + 10)}>aaa</button>{' '}
    </>
  )
}

export default App
