describe('test tag immutability', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('selection on immutable hashtags', () => {
    it.only('select partial tag starting a few characters before the tag, selection stretched only to the middle of the tag, yields a selection of the whole tag', () => {
      // selection inteverntion does not work unless it received the focus once.
      cy.get('#prosemirror-tagging-editor [contenteditable]').focus()

      // in the text: "here is a #hashtag and here is a @mention ", try to select "re is a #ha"
      cy.get('#prosemirror-tagging-editor [contenteditable]').then($div => {
        cy.wrap($div).setSelection({
          anchorNode: $div[0].querySelector('p').childNodes[0],
          anchorOffset: 2,
          focusNode: $div[0].querySelector('p').childNodes[1].firstChild,
          focusOffset: 3
        })
      })

      // expect the selection to automatically include the full hashtag.
      expectSelectionToEqual('re is a #hashtag')

      // same selection in the reverse direction
      cy.get('#prosemirror-tagging-editor [contenteditable]').then($div => {
        cy.wrap($div).setSelection({
          anchorNode: $div[0].querySelector('p').childNodes[1].firstChild,
          anchorOffset: 3,
          focusNode: $div[0].querySelector('p').childNodes[0],
          focusOffset: 2
        })
      })

      expectSelectionToEqual('re is a #hashtag')
    })

    it.only('select partial tag starting a few characters after the tag, selection going backward stretched only to the middle of the tag, yields a selection of the whole tag', () => {
      // selection inteverntion does not work unless it received the focus once.
      cy.get('#prosemirror-tagging-editor [contenteditable]').focus()

      // in the text "here is a #hashtag and here is a @mention " try to select "#shtag an"
      cy.get('#prosemirror-tagging-editor [contenteditable]').then($div => {
        cy.wrap($div).setSelection({
          anchorNode: $div[0].querySelector('p').childNodes[1].firstChild,
          anchorOffset: 3,
          focusNode: $div[0].querySelector('p').childNodes[2],
          focusOffset: 3
        })
      })

      expectSelectionToEqual('#hashtag an')

      // same selection in the reverse direction
      cy.get('#prosemirror-tagging-editor [contenteditable]').then($div => {
        cy.wrap($div).setSelection({
          anchorNode: $div[0].querySelector('p').childNodes[2],
          anchorOffset: 3,
          focusNode: $div[0].querySelector('p').childNodes[1].firstChild,
          focusOffset: 3
        })
      })

      expectSelectionToEqual('#hashtag an')
    })

    describe('cursor selection', () => {
      it('click "leftArrow" when cursor is after hashtag', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          'Go to #off{enter}{leftArrow}'
        )
        expectSelectionToEqual('#office')
      })

      it('type multiple "leftArrow"s when hashtag in the beginning', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          '#reading{enter}something{home}{leftArrow}{leftArrow}{leftArrow}'
        )
        expectSelectionToEqual('')

        cy.get('#tagging-immutable-hashtags-with-fixture')
          .type('think of ')
          .invoke('text')
          .should('equal', 'think of #reading something')

        cy.contains('#reading').should(
          'have.prop',
          'tagName',
          'hashtag'.toUpperCase()
        )
        cy.contains('think of ').should('not.have.class', 'editing-hashtag')
      })

      it('walk around a resolved hashtag', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          'Go to #off{enter}{leftArrow}{leftArrow}'
        )
        expectSelectionToEqual('')

        cy.get('#tagging-immutable-hashtags-with-fixture').type('{rightArrow}')
        expectSelectionToEqual('#office')

        cy.get('#tagging-immutable-hashtags-with-fixture').type('{rightArrow}')
        expectSelectionToEqual('')
      })

      it('walk around a resolved hashtag - challenge end of hashtag - simple', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          'Go to #off{enter}{leftArrow}{rightArrow}'
        )
        expectSelectionToEqual('')

        cy.get('#tagging-immutable-hashtags-with-fixture')
          .type('a')
          .invoke('text')
          .should('contain', 'Go to #officea')

        // Test that the hashtag has not changed
        cy.contains('#office')
          .invoke('text')
          .should('equal', '#office')
      })

      it('walk around a resolved hashtag - challenge end of hashtag - more right and left keys', () => {
        cy.get('#tagging-immutable-hashtags-with-fixture').type(
          'Go to #off{enter}{backspace}{leftArrow}{leftArrow}{leftArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}'
        )
        expectSelectionToEqual('')

        cy.get('#tagging-immutable-hashtags-with-fixture')
          .type('a')
          .invoke('text')
          .should('equal', 'Go to #officea')

        // Test that the hashtag has not changed
        cy.contains('#office')
          .invoke('text')
          .should('equal', '#office')
      })
    })

    it.skip('does not paint unresolved hashtags on hashtags-immutables state', () => {
      cy.get('#tagging-immutable-hashtags-with-fixture')
        .type('good #after noon')
        .within(() => {
          cy.contains('after').should('have.class', 'editing-hashtag')
        })
      cy.get('#tagging-immutable-hashtags-with-fixture')
        .type('good #after noon')
        .within(() => {
          cy.contains('after').should('not.have.class', 'editing-hashtag')
        })
    })
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
})

function expectSelectionToEqual(value: string) {
  cy.window()
    .invoke('getSelection')
    .invoke('toString')
    .should('equal', value)
}
