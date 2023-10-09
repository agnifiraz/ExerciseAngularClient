describe('expense add test', () => {
  it('visits the employee page and adds an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'expenses').click();
    cy.contains('control_point').click();
    cy.get('mat-select[formcontrolname="employeeid"]').click();
    cy.get('mat-option').contains('Pincher').click();
    cy.get('mat-select[formcontrolname="categoryid"]').click({ force: true });
    cy.get('mat-option').contains('Travel').click();
    cy.get('input[formcontrolname=description')
      .click({ force: true })
      .type('Bought Gas');
    cy.get('input[formcontrolname=amount').click({ force: true }).type('23.99');
    cy.get('input[formcontrolname=dateincurred')
      .click({ force: true })
      .type('11/01/2023');
    cy.get('button').contains('Save').click();
    cy.contains('added!');
  });
});
