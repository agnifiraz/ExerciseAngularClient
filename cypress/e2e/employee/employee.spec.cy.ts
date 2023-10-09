describe('employee page test', () => {
    it('Visits the employee project page', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'employees').click();
    cy.contains('employees loaded!!');
    });
   });