import * as React from 'react'
import ProseView, { ProseViewProps } from './views/ProseView'

const ProseMirror = React.forwardRef(function ProseMirror(
  props: ProseViewProps,
  ref
) {
  return <ProseView {...props} ref={ref} />
})

export default ProseMirror
