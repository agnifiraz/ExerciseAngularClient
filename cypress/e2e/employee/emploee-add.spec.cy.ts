describe('employee add test', () => {
  it('visits the employee page and adds an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'employees').click();
    cy.contains('control_point').click();
    cy.get('input[formcontrolname=title').type('Mr.');
    cy.get('input[formcontrolname=firstname')
      .click({ force: true })
      .type('John');
    cy.get('input[formcontrolname=lastname').click({ force: true }).type('Doe');
    cy.get('input[formcontrolname=phoneno')
      .click({ force: true })
      .type('(555)555-5555');
    cy.get('input[formcontrolname=email')
      .click({ force: true })
      .type('jd@here.com');
    cy.get('button').contains('Save').click();
    cy.contains('added!');
  });
});
