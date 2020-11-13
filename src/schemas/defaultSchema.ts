import { schema as schemaBasic } from 'prosemirror-schema-basic'
import OrderedMap from 'orderedmap'
import { NodeSpec, Schema } from 'prosemirror-model'

export function useDefaultSchema(
  options: { multiline: boolean; disableMarks: boolean } = {
    multiline: true,
    disableMarks: false
  }
): Schema {
  return new Schema({
    nodes: (schemaBasic.spec.nodes as OrderedMap<NodeSpec>).update(
      'doc',
      options.multiline
        ? (schemaBasic.spec.nodes as OrderedMap<NodeSpec>).get('doc')!
        : { content: 'block' }
    ),
    marks: options.disableMarks ? undefined : schemaBasic.spec.marks
  })
}
