describe('expense update test', () => {
  it('visits the expense page and updates an expense', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'expenses').click();
    cy.contains('01/11/2023').click();
    cy.get('input[formcontrolname=description]').clear();
    cy.get('input[formcontrolname=description]').type('Change Gas to Patrol');
    cy.get('button').contains('Save').click();
    cy.contains('updated!');
  });
});
