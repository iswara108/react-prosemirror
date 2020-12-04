export const unchangedTextDemoContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'I '
        },
        {
          type: 'text',
          marks: [
            {
              type: 'strong'
            }
          ],
          text: 'cannot'
        },
        {
          type: 'text',
          text: ' be changed'
        }
      ]
    }
  ]
}
export const standardTextDemoContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'I '
        },
        {
          type: 'text',
          marks: [
            {
              type: 'strong'
            }
          ],
          text: 'am'
        },
        {
          type: 'text',
          text: ' an initial text.'
        }
      ]
    }
  ]
}

export const taggingDemoContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'here is a ' },
        {
          type: 'hashtag',
          content: [{ type: 'text', text: '#hashtag' }]
        },
        { type: 'text', text: ' and here is a ' },
        {
          type: 'mention',
          content: [{ type: 'text', text: '@mention' }]
        },
        { type: 'text', text: ' ' }
      ]
    }
  ]
}
