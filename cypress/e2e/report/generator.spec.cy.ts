describe('generate expense report test', () => {
  it('visits the generator page and selects an employee and expenses', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'generator').click();
    cy.wait(500); // http call
    cy.get('mat-select[formcontrolname="employeeid"]').click();
    cy.contains('Smartypants').click();
    cy.wait(500); // http call
    cy.get('mat-select[formcontrolname="expenseid"]').click({ force: true });
    cy.contains('Hotel').click({ force: true });
    cy.get('button').contains('Save Report').click();
    cy.contains('added!');
  });
});
