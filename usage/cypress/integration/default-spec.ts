import { EditorView } from 'prosemirror-view'

describe('test default rich text box', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('enters simple text without delay', () => {
    cy.get('#prosemirror-multiline [contenteditable]')
      .type('hello world')
      .should('contain', 'hello world')
  })

  it('enters simple text with second word bolded', () => {
    cy.get('#prosemirror-multiline [contenteditable]')
      .type('hello {ctrl}b')
      .type('world')
      .should('contain', 'hello world')

    cy.get('#prosemirror-multiline [contenteditable] strong').should($bold =>
      expect($bold.text()).to.equal('world')
    )
    cy.contains('world').should('have.css', 'font-weight', '700')
  })

  it('checks component without marks allowed', () => {
    cy.get('#prosemirror-no-marks-multiline [contenteditable]')
      .type('hello {ctrl}b')
      .type('world')
      .should('contain', 'hello world')

    cy.get('#prosemirror-no-marks-multiline [contenteditable] strong').should(
      'not.exist'
    )
    cy.contains('world').should('have.css', 'font-weight', '400')
  })

  context('partial marks', () => {
    const testPartialSelectionMarks = (first: string, second: string) => {
      const NORMAL_WEIGHT = '400'
      const BOLD_WEIGHT = '700'
      cy.get('#prosemirror-multiline [contenteditable]')
        .setSelection(first)
        .type('{ctrl}b')
        .should('contain', first)
        .and('contain', second)

      cy.contains(second)
        .should('have.css', 'font-weight', NORMAL_WEIGHT)
        .and('have.css', 'font-style', 'normal')

      cy.contains(first)
        .should('have.css', 'font-weight', BOLD_WEIGHT)
        .and('have.css', 'font-style', 'normal')

      cy.get('#prosemirror-multiline [contenteditable]').type('{ctrl}b')

      cy.contains(second)
        .should('have.css', 'font-weight', NORMAL_WEIGHT)
        .and('have.css', 'font-style', 'normal')

      cy.contains(first)
        .should('have.css', 'font-weight', NORMAL_WEIGHT)
        .and('have.css', 'font-style', 'normal')

      cy.get('#prosemirror-multiline [contenteditable]').type('{ctrl}i')

      cy.contains(second)
        .should('have.css', 'font-weight', NORMAL_WEIGHT)
        .and('have.css', 'font-style', 'normal')

      cy.contains(first)
        .should('have.css', 'font-weight', NORMAL_WEIGHT)
        .and('have.css', 'font-style', 'italic')

      cy.get('#prosemirror-multiline [contenteditable]').type('{ctrl}b')

      cy.contains(second)
        .should('have.css', 'font-weight', NORMAL_WEIGHT)
        .and('have.css', 'font-style', 'normal')

      cy.contains(first)
        .should('have.css', 'font-weight', BOLD_WEIGHT)
        .and('have.css', 'font-style', 'italic')
    }

    it('enters two simple words, highlights first word and add/remove marks via keyboard strokes', () => {
      cy.get('#prosemirror-multiline [contenteditable]').type(
        'hello world{home}'
      )
      testPartialSelectionMarks('hello', ' world')
    })

    it('enters two simple words, highlights partial worlds and add/remove marks via keyboard strokes', () => {
      cy.get('#prosemirror-multiline [contenteditable]').type(
        'hello world{home}'
      )
      testPartialSelectionMarks('lo wor', 'hel')
    })
  })

  it('allows multiline', () => {
    cy.get('#prosemirror-multiline [contenteditable]')
      .type('oṃ{enter}namaḥ{enter}śivāya')
      .find('p')
      .should('have.length', 3)
      .and($el => {
        expect($el.text()).to.equal('oṃnamaḥśivāya')
      })
  })

  it('disallows multiline', () => {
    cy.get('#prosemirror-singleline [contenteditable]')
      .type('oṃ{enter}namaḥ{enter}śivāya')
      .find('p')
      .should('have.length', 1)
      .and('contain', 'oṃnamaḥśivāya')
  })

  it.skip('tests autofocus', () => {})

  it('disallows editing', () => {
    cy.get('#prosemirror-disable-edit [contenteditable]').as('readonly')

    cy.get('@readonly').contains(/^I cannot be changed$/)
    cy.get('@readonly')
      .type('{end} really?')
      .contains(/^I cannot be changed$/)
  })

  context('controlled components', () => {
    beforeEach(() => {
      cy.get('#prosemirror-controlled-1 [contenteditable]').as('controlled-1')
      cy.get('#prosemirror-controlled-2 [contenteditable]').as('controlled-2')
      cy.get('#prosemirror-controlled-3 [contenteditable]').as('controlled-3')
    })

    it('copies text automatically from one component to another', () => {
      cy.get('@controlled-1')
        .type('text')
        .contains(/^text$/)
      cy.get('@controlled-2').contains(/^text$/)

      cy.get('@controlled-2')
        .type('{end} 123')
        .contains(/^text 123$/)
      cy.get('@controlled-1').contains(/^text 123$/)
    })

    it('disabled-text component is updated but cannot change itself', () => {
      cy.get('@controlled-1')
        .type('text')
        .contains(/^text$/)
      cy.get('@controlled-3').contains(/^text$/)

      cy.get('@controlled-3')
        .type('{end} 123')
        .contains(/^text$/)
      cy.get('@controlled-1').contains(/^text$/)
    })
  })

  it('enables direct access to the editorView with ref', () => {
    cy.window()
      .its('editorView')
      .then((editorView: EditorView) => {
        const transaction = editorView.state.tr

        transaction.insertText('refs are working')
        editorView.dispatch(transaction)
      })
      .then(() => cy.get('#prosemirror-ref').contains('refs are working'))
  })
})
