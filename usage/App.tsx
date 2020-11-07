import * as React from 'react'
import 'prosemirror-menu/style/menu.css'
import ReactProseMirror from '../src'

// import { HASHTAG_SCHEMA_NODE_TYPE } from './components/tagging/model/taggingUtils';

function App() {
  return (
    <>
      <ReactProseMirror
        id="prosemirror-multiline"
        label="description"
        multiline
      />
      <ReactProseMirror id="prosemirror-singleline" label="description" />
    </>
  )
}

export default App
