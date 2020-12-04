/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    selection(fn: Function): Chainable<Element>
    setSelection(query: {
      anchorQuery: string // 'ul > li > p', // required
      anchorOffset?: number // default: 0
      focusQuery?: string // 'ul > li > p:last-child', // default: anchorQuery
      focusOffset?: number // default: 0
    }): Chainable<Element>
    setSelection(query: {
      anchorNode: Node // 'ul > li > p', // required
      anchorOffset?: number // default: 0
      focusNode?: Node // 'ul > li > p:last-child', // default: anchorQuery
      focusOffset?: number // default: 0
    }): Chainable<Element>

    setSelection(query: string, endQuery?: string): Chainable<Element>

    setCursor(query: string, atStart?: boolean): Chainable<Element>
    setCursorBefore(query: string): Chainable<Element>
    setCursorAfter(query: string): Chainable<Element>
  }
}
