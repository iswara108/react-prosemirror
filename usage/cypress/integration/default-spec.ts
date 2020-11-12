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
  context('controlled components', () => {
    cy.get('#prosemirror-controlled-1 [contenteditable]').as('controlled-1')
    cy.get('#prosemirror-controlled-2 [contenteditable]').as('controlled-2')

    it('copies text automatically from one component to another', () => {
      cy.get('@controlled-1')
        .type('text')
        .should('have.text', 'text')
      cy.get('@controlled-2').should('have.text', 'text')
    })
  })
})
