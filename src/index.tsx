import * as React from 'react'
import ProseView, { ProseViewProps } from './views/ProseView'

export default (props: ProseViewProps) => {
  return <ProseView {...props} />
}

export { createSchema, emptyDefaultDocument } from './views/ProseView'
