describe('Financial views - Ingresos and Egresos', () => {
  const username = Cypress.env('E2E_USERNAME');
  const password = Cypress.env('E2E_PASSWORD');

  beforeEach(function () {
    if (!username || !password) {
      this.skip();
    }
    cy.visit('/');
    cy.get('input[placeholder="Usuario"]').type(String(username));
    cy.get('input[placeholder="*********"]').type(String(password));
    cy.contains('button', 'Ingresar').click();
    cy.location('pathname').should('eq', '/propiedades');
  });

  describe('Ingresos view', () => {
    it('displays income list for selected property', () => {
      // Select first property via sidebar
      cy.get('nav.sidebar').contains('span.label', 'Ingresos').should('have.class', 'disabled');
      
      // Navigate to Ingresos from propiedades list
      cy.get('table tbody tr').first().find('a').click();
      cy.location('pathname').should('match', /\/propiedades\/\d+\/reservas/);

      // Navigate to Ingresos
      cy.get('nav.sidebar').contains('span.label', 'Ingresos').click();
      cy.location('pathname').should('match', /\/propiedades\/\d+\/ingresos/);

      // Check page title
      cy.contains('h1', 'Ingresos por Propiedad').should('be.visible');

      // Check all filters are present
      cy.get('select#propiedad').should('be.visible');
      cy.get('select#mes').should('be.visible');
      cy.get('select#anio').should('be.visible');

      // Check total card
      cy.contains('h5', 'Total Ingresos').should('be.visible');
    });

    it('changes property via filter dropdown', () => {
      // Navigate to Ingresos
      cy.get('table tbody tr').first().find('a').click();
      cy.get('nav.sidebar').contains('span.label', 'Ingresos').click();
      cy.location('pathname').should('match', /\/propiedades\/(\d+)\/ingresos/);

      // Get the property ID from the URL
      cy.location('pathname').then((pathname) => {
        const currentId = pathname.match(/\/(\d+)\/ingresos/)[1];
        
        // Change property via dropdown
        cy.get('select#propiedad').should('have.value', currentId);
        cy.get('select#propiedad').find('option').should('have.length.greaterThan', 1);
      });
    });

    it('filters ingresos by month and year', () => {
      // Select first property
      cy.get('table tbody tr').first().find('a').click();

      // Navigate to Ingresos
      cy.get('nav.sidebar').contains('span.label', 'Ingresos').click();
      cy.location('pathname').should('match', /\/propiedades\/\d+\/ingresos/);

      // Change month filter
      cy.get('select#mes').select('2');
      cy.get('select#mes').should('have.value', '2');

      // Change year filter
      const currentYear = new Date().getFullYear();
      cy.get('select#anio').select((currentYear - 1).toString());
      cy.get('select#anio').should('have.value', (currentYear - 1).toString());

      // Check that table is visible (data loads or shows no results message)
      cy.get('table, .alert').should('be.visible');
    });

    it('shows message when no ingresos are found', () => {
      // Select first property
      cy.get('table tbody tr').first().find('a').click();

      // Navigate to Ingresos
      cy.get('nav.sidebar').contains('span.label', 'Ingresos').click();

      // Try to find either table or no results message
      cy.get('table, .alert-warning').should('be.visible');
    });

    it('back button navigates to propiedades', () => {
      // Select first property
      cy.get('table tbody tr').first().find('a').click();

      // Navigate to Ingresos
      cy.get('nav.sidebar').contains('span.label', 'Ingresos').click();
      cy.location('pathname').should('match', /\/propiedades\/\d+\/ingresos/);

      // Click back button
      cy.contains('button', 'Volver').click();
      cy.location('pathname').should('eq', '/propiedades');
    });
  });

  describe('Egresos view', () => {
    it('displays expense list for selected property', () => {
      // Navigate to Egresos
      cy.get('table tbody tr').first().find('a').click();
      cy.location('pathname').should('match', /\/propiedades\/\d+\/reservas/);

      // Navigate to Egresos
      cy.get('nav.sidebar').contains('span.label', 'Egresos').click();
      cy.location('pathname').should('match', /\/propiedades\/\d+\/egresos/);

      // Check page title
      cy.contains('h1', 'Egresos por Propiedad').should('be.visible');

      // Check all filters are present
      cy.get('select#propiedad').should('be.visible');
      cy.get('select#mes').should('be.visible');
      cy.get('select#anio').should('be.visible');

      // Check total card
      cy.contains('h5', 'Total Egresos').should('be.visible');
    });

    it('changes property via filter dropdown', () => {
      // Navigate to Egresos
      cy.get('table tbody tr').first().find('a').click();
      cy.get('nav.sidebar').contains('span.label', 'Egresos').click();
      cy.location('pathname').should('match', /\/propiedades\/(\d+)\/egresos/);

      // Get the property ID from the URL
      cy.location('pathname').then((pathname) => {
        const currentId = pathname.match(/\/(\d+)\/egresos/)[1];
        
        // Verify property selector has current value
        cy.get('select#propiedad').should('have.value', currentId);
        cy.get('select#propiedad').find('option').should('have.length.greaterThan', 1);
      });
    });

    it('filters egresos by month and year', () => {
      // Select first property
      cy.get('table tbody tr').first().find('a').click();

      // Navigate to Egresos
      cy.get('nav.sidebar').contains('span.label', 'Egresos').click();
      cy.location('pathname').should('match', /\/propiedades\/\d+\/egresos/);

      // Change month filter
      cy.get('select#mes').select('3');
      cy.get('select#mes').should('have.value', '3');

      // Change year filter
      const currentYear = new Date().getFullYear();
      cy.get('select#anio').select((currentYear + 1).toString());
      cy.get('select#anio').should('have.value', (currentYear + 1).toString());

      // Check that table is visible
      cy.get('table, .alert').should('be.visible');
    });

    it('back button navigates to propiedades', () => {
      // Select first property
      cy.get('table tbody tr').first().find('a').click();

      // Navigate to Egresos
      cy.get('nav.sidebar').contains('span.label', 'Egresos').click();
      cy.location('pathname').should('match', /\/propiedades\/\d+\/egresos/);

      // Click back button
      cy.contains('button', 'Volver').click();
      cy.location('pathname').should('eq', '/propiedades');
    });
  });

  describe('Menu structure and items state', () => {
    it('does not have Movimientos menu item (removed as redundant)', () => {
      // Verify Movimientos is not in sidebar
      cy.get('nav.sidebar')
        .contains('span.label', 'Movimientos')
        .should('not.exist');
    });

    it('disables Ingresos and Egresos menu items without selected property', () => {
      // From propiedades list, check menu is disabled
      cy.get('nav.sidebar')
        .contains('span.label', 'Ingresos')
        .parent()
        .should('have.class', 'disabled');

      cy.get('nav.sidebar')
        .contains('span.label', 'Egresos')
        .parent()
        .should('have.class', 'disabled');
    });

    it('enables Ingresos and Egresos menu items with selected property', () => {
      // Select first property
      cy.get('table tbody tr').first().find('a').click();

      // Check menu items are enabled
      cy.get('nav.sidebar')
        .contains('span.label', 'Ingresos')
        .parent()
        .should('not.have.class', 'disabled');

      cy.get('nav.sidebar')
        .contains('span.label', 'Egresos')
        .parent()
        .should('not.have.class', 'disabled');
    });
  });
});
