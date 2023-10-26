//https://glebbahmutov.com/blog/sync-two-cypress-runners/
describe('alice spec', () => {
    it('passes', () => {
        cy.visit('/?user=alice')
    })
})