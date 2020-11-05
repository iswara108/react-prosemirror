import * as React from 'react'
import * as ReactDOM from 'react-dom'

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<p>Hello</p>, div)
    ReactDOM.unmountComponentAtNode(div)
  })
})
