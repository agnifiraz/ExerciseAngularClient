describe('employee delete test', () => {
  it('visits the employee page and deletes an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'employees').click();
    cy.contains('Doe').click();
    cy.get('button').contains('Delete').click();
    cy.contains('deleted!');
  });
});
