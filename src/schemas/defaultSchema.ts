import * as React from 'react'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import OrderedMap from 'orderedmap'
import { NodeSpec, Schema } from 'prosemirror-model'

export function useDefaultSchema({
  multiline = true,
  disableMarks = false
}: {
  multiline?: boolean
  disableMarks?: boolean
} = {}): Schema {
  // keep the schema state for reference equality.
  // This is beneficial when two mirrored controlled components share a schema.
  const [schema] = React.useState(
    new Schema({
      nodes: (schemaBasic.spec.nodes as OrderedMap<NodeSpec>).update(
        'doc',
        multiline
          ? (schemaBasic.spec.nodes as OrderedMap<NodeSpec>).get('doc')!
          : { content: 'block' }
      ),
      marks: disableMarks ? undefined : schemaBasic.spec.marks
    })
  )

  return schema
}
