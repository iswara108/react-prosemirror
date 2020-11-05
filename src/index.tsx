import * as React from 'react'
import ProseView from './views/ProseView'

type Props = {
  id: string
  label: string
  multiline?: boolean
}

export default ({ id, label, multiline = false }: Props) => {
  console.log(id, label, multiline)
  return <ProseView />
}
