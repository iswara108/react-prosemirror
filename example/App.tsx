import * as React from 'react'
// import applyDevTools from 'prosemirror-dev-tools';

import ReactProseMirror from '../src'

// import { HASHTAG_SCHEMA_NODE_TYPE } from './components/tagging/model/taggingUtils';

function App() {
  return (
    <>
      <ReactProseMirror id="prosemirror-multiline" label="description" />
    </>
  )
}

export default App
