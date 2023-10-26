describe('template spec', () => {
  it('passes', () => {

    // cy.session('alice', () => {
      cy.visit('/?db=alice')
      cy.contains('Decentralized Addressbook of alice',{timeout:10000})
      cy.get('[data-cy=settings]').click()
      cy.get('[data-cy=address]').click()
      cy.get('[data-cy=txtFirstname]').type('Alice')
      cy.get('[data-cy=txtLastname]').type('Brown')
      cy.get('[data-cy=txtStreet]').type('Tchaikovsky av. 12')
      cy.get('[data-cy=txtZipCode]').type('12345')
      cy.get('[data-cy=txtCity]').type('New York')
      cy.get('[data-cy=txtCountry]').type('USA')
      cy.get('[data-cy=chkMyOwn] > input').check({force: true})
      cy.get('[data-cy=addContact]').click()
      cy.get('table > tbody > tr > td').contains('Alice')
    // })
  })
})