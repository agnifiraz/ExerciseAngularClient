describe('expense delete test', () => {
  it('visits the employee page and deletes an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'expenses').click();
    cy.contains('01/11/2023').click();
    cy.get('button').contains('Delete').click();
    cy.get('button').contains('Yes').click();
    cy.contains('deleted!');
  });
});
