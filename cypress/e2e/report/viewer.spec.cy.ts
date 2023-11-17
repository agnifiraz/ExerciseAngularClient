describe('generate expense report test', () => {
  it('visits the viewer page and selects an employee and report', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'viewer').click();
    cy.wait(500); // http call
    cy.get('mat-select[formcontrolname="employeeid"]').click();
    cy.contains('Paul').click();
    cy.wait(500); // http call
    cy.get('mat-select[formcontrolname="reportid"]').click({ force: true });
    cy.contains('11/17/23').click({ force: true });
    // cy.get('button').contains('Save Report').click();
    cy.contains('Created on');
  });
});

// {{selectedReport?.datecreated | date: 'short' : 'GMT-5'}} // GMT-4 for standard time
