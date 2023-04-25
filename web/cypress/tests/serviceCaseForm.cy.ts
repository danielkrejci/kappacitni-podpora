/// <reference types="cypress" />

it('Submit ServiceCase Form', () => {
    // cy.visit('http://localhost:3000')
    cy.visit('http://kappasupport.danielkrejci.cz')
    cy.get('a[href="/device/myphone"]').click()

    cy.get('select#case-type').select(1)

    cy.get('input#serialNumber').clear().type('SI2E26ZDBD6YVKQ').should('have.value', 'SI2E26ZDBD6YVKQ')

    cy.get('textarea#message').clear().type('Můj telefon myPhone nejde zapnout. Nevim co dal help mi plz <3').should('not.be.empty')

    cy.get('input#name').clear().type('Tomáš').should('have.value', 'Tomáš')

    cy.get('input#surname').clear().type('Špatný').should('have.value', 'Špatný')

    cy.get('input#email').clear().type('krejcda2@uhk.cz').should('have.value', 'krejcda2@uhk.cz')

    cy.get('input#phone').type('600987123').should('have.value', '600987123')

    cy.get('input#street').type('Hradecká').should('have.value', 'Hradecká')

    cy.get('input#houseNumber').type('123').should('have.value', '123')

    cy.get('input#city').type('Hradec Králové').should('have.value', 'Hradec Králové')

    cy.get('input#postalCode').type('50001').should('have.value', '50001')

    cy.get('input#terms').check().should('be.checked')

    cy.get('button').contains('Odeslat').click()

    cy.get('h2').contains('Žádost byla odeslána').should('exist')

    cy.get('p strong').should('contain.text', 'krejcda2@uhk.cz')
})
