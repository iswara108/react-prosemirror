/// <reference types="cypress" />
/// <reference path="./index.d.ts"/>
/**
 * Credits
 * @Bkucera: https://github.com/cypress-io/cypress/issues/2839#issuecomment-447012818
 * @Phrogz: https://stackoverflow.com/a/10730777/1556245
 *
 * Usage
 * ```
 * // Types "foo" and then selects "fo"
 * cy.get('input')
 *   .type('foo')
 *   .setSelection('fo')
 *
 * // Types "foo", "bar", "baz", and "qux" on separate lines, then selects "foo", "bar", and "baz"
 * cy.get('textarea')
 *   .type('foo{enter}bar{enter}baz{enter}qux{enter}')
 *   .setSelection('foo', 'baz')
 *
 * // Types "foo" and then sets the cursor before the last letter
 * cy.get('input')
 *   .type('foo')
 *   .setCursorAfter('fo')
 *
 * // Types "foo" and then sets the cursor at the beginning of the word
 * cy.get('input')
 *   .type('foo')
 *   .setCursorBefore('foo')
 *
 * // `setSelection` can alternatively target starting and ending nodes using query strings,
 * // plus specific offsets. The queries are processed via `Element.querySelector`.
 * cy.get('body')
 *   .setSelection({
 *     anchorQuery: 'ul > li > p', // required
 *     anchorOffset: 2 // default: 0
 *     focusQuery: 'ul > li > p:last-child', // default: anchorQuery
 *     focusOffset: 0 // default: 0
 *    })
 */

// Low level command reused by `setSelection` and low level command `setCursor`
Cypress.Commands.add('selection', { prevSubject: true }, (subject, fn) => {
  cy.wrap(subject)
    .trigger('mousedown')
    .then(fn)
    .trigger('mouseup')

  cy.document().trigger('selectionchange')
  return cy.wrap(subject)
})

Cypress.Commands.add(
  'setSelection',
  { prevSubject: true },
  (subject, query, endQuery) => {
    return cy.wrap(subject).selection(($el: JQuery<Element>) => {
      if (typeof query === 'string') {
        const anchorNode = getTextNode($el[0], query)
        const focusNode = endQuery ? getTextNode($el[0], endQuery) : anchorNode
        const anchorOffset = anchorNode.wholeText.indexOf(query)
        const focusOffset = endQuery
          ? focusNode.wholeText.indexOf(endQuery) + endQuery.length
          : anchorOffset + query.length
        setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset)
      } else if (typeof query === 'object') {
        const el = $el[0]
        const anchorNode =
          typeof query.anchorQuery === 'string'
            ? getTextNode(el.querySelector(query.anchorQuery))
            : query.anchorNode
        const anchorOffset = query.anchorOffset || 0
        const focusNode = query.focusNode
          ? query.focusNode
          : typeof query.focusQuery === 'string'
          ? getTextNode(el.querySelector(query.focusQuery))
          : anchorNode
        const focusOffset = query.focusOffset || 0
        console.log(anchorNode, anchorOffset, focusNode, focusOffset)
        setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset)
      }
    })
  }
)

// Low level command reused by `setCursorBefore` and `setCursorAfter`, equal to `setCursorAfter`
Cypress.Commands.add(
  'setCursor',
  { prevSubject: true },
  (subject, query: string, atStart: boolean) => {
    return cy.wrap(subject).selection($el => {
      const node = getTextNode($el[0], query)
      const offset =
        node.wholeText.indexOf(query) + (atStart ? 0 : query.length)
      const document = node.ownerDocument
      document.getSelection().removeAllRanges()
      document.getSelection().collapse(node, offset)
    })
    // Depending on what you're testing, you may need to chain a `.click()` here to ensure
    // further commands are picked up by whatever you're testing (this was required for Slate, for example).
  }
)

Cypress.Commands.add(
  'setCursorBefore',
  { prevSubject: true },
  (subject, query) => {
    cy.wrap(subject).setCursor(query, true)
  }
)

Cypress.Commands.add(
  'setCursorAfter',
  { prevSubject: true },
  (subject, query) => {
    cy.wrap(subject).setCursor(query)
  }
)

// Helper functions

function getTextNode(el: Node, match?: string): Text {
  const walk = window.document.createTreeWalker(
    el,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )
  if (!match) {
    return walk.nextNode() as Text
  }

  let node: Text
  while ((node = walk.nextNode() as Text)) {
    if (node.wholeText.includes(match)) {
      return node
    }
  }
}

function setBaseAndExtent(...args) {
  const document = args[0].ownerDocument
  document.getSelection().removeAllRanges()
  document.getSelection().setBaseAndExtent(...args)
}
