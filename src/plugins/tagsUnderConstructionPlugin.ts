import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey, Selection } from 'prosemirror-state'
import { Node } from 'prosemirror-model'
import XRegExp from 'xregexp'
// import { findEditingHashtag, findAllHashtags } from '../model/taggingUtils'

function decorateHashtags(doc: Node, _selection: Selection) {
  const allHashtags = findAllHashtags(doc)

  return DecorationSet.create(
    doc,
    allHashtags.map(hashtag =>
      Decoration.inline(hashtag.start + 1, hashtag.end + 1, {
        class: 'editing-hashtag'
      })
    )
  )
}

// This plugin serves two purposes:
// 1. Decorate editing tags (unresolved tags)
// 2. Disables the "enter" key when the cursor is on a tag being edited, designating it to resolving a tag from the list of suggestions
const hashtagPlugin = new Plugin({
  key: new PluginKey('Hashtag Plugin'),
  state: {
    init(_, instance) {
      return decorateHashtags(instance.doc, instance.selection)
    },

    apply(tr, _oldDecoration) {
      return decorateHashtags(tr.doc, (tr as any).curSelection)
    }
  },
  props: {
    decorations(editorState) {
      return this.getState(editorState)
    },

    handleDOMEvents: {
      keydown: (view, event) => {
        // In case of a multiline view, disable "Enter" key when a tag is being edited to allow resolving tag via the "Enter" key.
        if (event.key === 'Enter') {
          const currentEditingTag = findEditingHashtag(
            view.state.doc,
            view.state.selection
          )
          if (currentEditingTag) event.preventDefault()
        }
        // todo: Maybe return true?
        return false
      }
    }
  }
})

// This function takes a node with taggingSchema and returns an object with an array of all hashtags and an array of all mentions
const getTokens = (doc: Node) => {
  let tokens: { hashtags: Hashtag[]; mentions: Mention[] } = {
    hashtags: [],
    mentions: []
  }

  doc.descendants((node, pos, parent) => {
    // do not consider resolved tag nodes.
    if (parent.type.name === 'hashtag' || parent.type.name === 'mention')
      return false // do not recurse over children of a resolved hashtag

    if (
      !node.isText ||
      node.type.name === 'hashtag' ||
      node.type.name === 'mention'
    )
      return // only handle text nodes which might have a token

    const tokenizer = Tokenizer(node.textContent)

    const hashtags = tokenizer.hashtags.map(hashtag => ({
      start: hashtag.start + pos - 1,
      end: hashtag.end + pos - 1,
      value: hashtag.value
    }))
    const mentions = tokenizer.mentions.map(mention => ({
      start: mention.start + pos - 1,
      end: mention.end + pos - 1,
      value: mention.value
    }))

    const token = { hashtags, mentions }
    tokens.hashtags.push(...token.hashtags)
    tokens.mentions.push(...token.mentions)
    return
  })
  return tokens
}

// get a hashtag object, containing the keys:
// {
//  start: Number,
//  end: Number,
//  value: String
// }
const findEditingHashtag = (doc: Node, selection: Selection) => {
  const tokens = getTokens(doc)
  const lowestSelection = Math.min(selection.anchor, selection.head)
  const highestSelection = Math.max(selection.anchor, selection.head)

  return tokens.hashtags.find(
    hashtag =>
      hashtag.start + 1 <= lowestSelection &&
      hashtag.end + 1 >= highestSelection
  )
}
const findEditingMention = (doc: Node, selection: Selection) => {
  const tokens = getTokens(doc)
  const lowestSelection = Math.min(selection.anchor, selection.head)
  const highestSelection = Math.max(selection.anchor, selection.head)

  return tokens.mentions.find(
    mention =>
      mention.start + 1 <= lowestSelection &&
      mention.end + 1 >= highestSelection
  )
}

const findAllHashtags = (doc: Node) => {
  return getTokens(doc).hashtags
}

const findAllMentions = (doc: Node) => {
  return getTokens(doc).mentions
}

/**
 * TokenizerJS
 *
 * @param text String input to be tokenized.
 * @returns object Entites containing array of
 *   hashtags, mentions, and links.
 */
const Tokenizer = (text: string) => {
  const entities: {
    hashtags: Hashtag[]
    mentions: Mention[]
  } = {
    hashtags: [],
    mentions: []
  }

  for (var i = 0; i <= text.length; i++) {
    if (text[i] === '#') {
      var hashtag = Hashtag.parse(i, text)
      if (hashtag instanceof Hashtag) hashtag.value = hashtag.value.slice(1)

      if (typeof hashtag !== 'number') {
        i = hashtag.end
        entities.hashtags.push(hashtag)
      }
    } else if (text[i] === '@') {
      var mention = Mention.parse(i, text)
      if (mention instanceof Mention) mention.value = mention.value.slice(1)

      if (typeof mention !== 'number') {
        i = mention.end
        entities.mentions.push(mention)
      }
    }
  }

  return entities
}

/**
 * Token
 * Basic description of the token.
 * A token has a zero-based starting
 * and ending position and a string value.
 */
class Token {
  start
  end
  value: string
  constructor(start: number, value: string) {
    if (!Number.isInteger(start)) {
      throw new Error(
        'Attempting to create a new Token with starting position ' +
          "'" +
          start +
          "' of type '" +
          typeof start +
          "', but Token must" +
          " have an integer value as it's starting position."
      )
    }

    if (value.length === 0) {
      throw new Error(
        'Attempting to create a new Token with no value at ' + start
      )
    }

    this.start = start
    this.end = start + value.length - 1
    this.value = value
  }
}

/**
 * Hashtag token.
 */
class Hashtag extends Token {
  constructor(start: number, value: string) {
    super(start, value)
  }

  /**
   * Hashtags start with a '#' followed
   * by an series of alphanumeric characters.
   *
   * @params start Number the position in `text`
   *   to start parsing at.
   * @params text String the text to parse.
   *
   * @returns Hashtag | Number - A new Hashtag token
   *   if one was found. The ending position if none
   *   was found.
   */
  static parse(start: number, text: string) {
    if (text[start] !== '#') {
      return start
    }

    var value = '#'
    var i = start

    for (i; i < text.length; i++) {
      if (XRegExp('^[#\\pL0-9-]+$').test(text[i])) {
        value += text[i]
      } else {
        break
      }
    }

    if (value.length >= 1) {
      return new Hashtag(start, value)
    }

    return i
  }
}

/**
 * Mention token.
 */
class Mention extends Token {
  constructor(start: number, value: string) {
    super(start, value)
  }

  /**
   * Mentions start with a '@' followed
   * by an series of alphanumeric characters.
   *
   * @params start Number the position in `text`
   *   to start parsing at.
   * @params text String the text to parse.
   *
   * @returns Hashtag | Number - A new Hashtag token
   *   if one was found. The ending position if none
   *   was found.
   */
  static parse(start: number, text: string) {
    if (text[start] !== '@') {
      return start
    }

    var value = '@'
    var i = start

    for (i; i < text.length; i++) {
      if (XRegExp('^[@\\pL0-9-]+$').test(text[i])) {
        value += text[i]
      } else {
        break
      }
    }

    if (value.length >= 1) {
      return new Mention(start, value)
    }

    return i
  }
}

export default hashtagPlugin
