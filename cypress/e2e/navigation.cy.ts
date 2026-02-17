describe('SPA navigation between modules', () => {
  const username = Cypress.env('E2E_USERNAME');
  const password = Cypress.env('E2E_PASSWORD');

  beforeEach(function () {
    if (!username || !password) {
      this.skip();
    }
  });

  it('keeps session and navigates without full reload', () => {
    cy.visit('/');

    cy.get('input[placeholder="Usuario"]').type(String(username));
    cy.get('input[placeholder="*********"]').type(String(password));
    cy.contains('button', 'Ingresar').click();

    cy.location('pathname').should('eq', '/propiedades');
    cy.window().its('sessionStorage').invoke('getItem', 'token').should('not.be.empty');

    cy.window().then((win) => {
      const count = win.performance.getEntriesByType('navigation').length;
      cy.wrap(count).as('navCount');
    });

    cy.get('nav.sidebar').should('be.visible');
    cy.contains('span.label', 'Propiedades').should('be.visible');

    cy.get('table tbody tr').first().find('a').click();
    cy.location('pathname').should('match', /\/propiedades\/\d+\/reservas/);
    cy.window().its('sessionStorage').invoke('getItem', 'token').should('not.be.empty');

    cy.get('@navCount').then((count) => {
      cy.window().then((win) => {
        const after = win.performance.getEntriesByType('navigation').length;
        expect(after).to.eq(count);
      });
    });

    cy.get('nav.sidebar').contains('span.label', 'Movimientos').click();
    cy.location('pathname').should('match', /\/propiedades\/\d+\/movimientos/);
    cy.window().its('sessionStorage').invoke('getItem', 'token').should('not.be.empty');
  });
});
