import * as React from 'react'
import { schema as schemaBasic } from 'prosemirror-schema-basic'
import OrderedMap from 'orderedmap'
import { NodeSpec, Schema } from 'prosemirror-model'

export function useTaggingSchema({
  multiline = true,
  disableMarks = false,
  excludeHashtags = false,
  excludeMentions = false
}: {
  multiline?: boolean
  disableMarks?: boolean
  excludeHashtags?: boolean
  excludeMentions?: boolean
} = {}): Schema {
  // keep the schema state for reference equality.
  // This is beneficial when two mirrored controlled components share a schema.
  let nodes = schemaBasic.spec.nodes as OrderedMap<NodeSpec>
  if (!excludeHashtags)
    nodes = nodes.addBefore('text', 'hashtag', {
      group: 'inline',
      atom: true,
      content: 'text*',
      inline: true,
      toDOM: _node => ['hashtag', 0],
      parseDOM: [{ tag: 'hashtag' }],
      selectable: true,
      draggable: true
    })

  if (!excludeMentions)
    nodes = nodes.addBefore('text', 'mention', {
      group: 'inline',
      atom: true,
      content: 'text*',
      inline: true,
      toDOM: _node => ['mention', 0],
      parseDOM: [{ tag: 'mention' }],
      selectable: true,
      draggable: true
    })

  nodes = nodes.update(
    'doc',
    multiline
      ? (schemaBasic.spec.nodes as OrderedMap<NodeSpec>).get('doc')!
      : { content: 'block' }
  )
  const [schema] = React.useState(
    new Schema({
      nodes,
      marks: disableMarks ? undefined : schemaBasic.spec.marks
    })
  )

  return schema
}
