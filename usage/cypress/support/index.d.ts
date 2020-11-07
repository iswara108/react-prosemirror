/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    setSelection(query: {
      anchorQuery: string // 'ul > li > p', // required
      anchorOffset?: number // default: 0
      focusQuery?: string // 'ul > li > p:last-child', // default: anchorQuery
      focusOffset?: number // default: 0
    }): Chainable<Element>

    setSelection(query: string, endQuery?: string): Chainable<Element>

    setCursorBefore(query: string): Chainable<Element>
    setCursorAfter(query: string): Chainable<Element>
  }
}
