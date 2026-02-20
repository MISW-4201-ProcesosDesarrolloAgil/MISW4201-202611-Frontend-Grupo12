describe('PK71 - Ver secciones en menú principal', () => {
  it('Muestra las secciones y permite navegar sin recargar', () => {
    // Visitar raíz y simular sesión
    cy.visit('/');
    cy.window().then(win => {
      win.sessionStorage.setItem('token', 'dummy-token');
      win.sessionStorage.setItem('idUsuario', '1');
    });

    // Capturar número de entradas de navegación inicial
    cy.window().then(win => {
      cy.wrap(win.performance.getEntriesByType('navigation').length).as('navBefore');
    });

    // Stub para capturar errores de consola
    cy.window().then(win => {
      cy.stub(win.console, 'error').as('consoleError');
    });

    // Comprobar sidebar y secciones
    cy.visit('/propiedades');
    cy.get('app-sidebar').should('exist');
    // 'Inicio' is used as the main home entry in the current sidebar
    cy.get('app-sidebar').contains('Inicio').should('exist');
    cy.get('app-sidebar').contains('Propiedades').should('exist');
    cy.get('app-sidebar').contains('Reservas').should('exist');
    cy.get('app-sidebar').contains('Movimientos').should('exist');

    // Navegación a Inicio (home)
    cy.get('app-sidebar').contains('Inicio').click();
    cy.url().should('include', '/');
    cy.get('app-sidebar').find('li.active').should('contain', 'Inicio');

    // Navegación a Propiedades
    cy.get('app-sidebar').contains('Propiedades').click();
    cy.url().should('include', '/propiedades');
    cy.get('app-sidebar').find('li.active').should('contain', 'Propiedades');

    // Navegación a Reservas (puede requerir propiedad seleccionada)
    cy.get('app-sidebar').contains('Reservas').click();
    cy.url().then(url => {
      const wentToReservas = url.includes('/reservas');
      const wentToPropiedades = url.includes('/propiedades');
      expect(wentToReservas || wentToPropiedades).to.be.true;
      if (wentToReservas) {
        cy.get('app-sidebar').find('li.active').should('contain', 'Reservas');
      } else {
        cy.get('app-sidebar').find('li.active').should('contain', 'Propiedades');
      }
    });

    // Navegación a Movimientos (puede requerir propiedad seleccionada)
    cy.get('app-sidebar').contains('Movimientos').click();
    cy.url().then(url => {
      const wentToMovimientos = url.includes('/movimientos');
      const wentToPropiedades2 = url.includes('/propiedades');
      expect(wentToMovimientos || wentToPropiedades2).to.be.true;
      if (wentToMovimientos) {
        cy.get('app-sidebar').find('li.active').should('contain', 'Movimientos');
      } else {
        cy.get('app-sidebar').find('li.active').should('contain', 'Propiedades');
      }
    });

    // Verificar que no se llamaron errores de consola
    cy.get('@consoleError').should('not.be.called');

    // Verificar que no aumentaron las entradas de navegación (no full reload)
    cy.get('@navBefore').then(before => {
      cy.window().then(win => {
        const after = win.performance.getEntriesByType('navigation').length;
        expect(after).to.equal(before);
      });
    });
  });
});
