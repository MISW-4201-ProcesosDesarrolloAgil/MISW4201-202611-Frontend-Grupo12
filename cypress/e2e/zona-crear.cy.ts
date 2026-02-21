describe('Zona - crear', () => {
  const propiedadId = 1;

  beforeEach(() => {
    cy.intercept('GET', '**/zonas-posibles', ['COCINA', 'SALA', 'HABITACION']).as('zonasPosibles');
    cy.intercept('POST', `**/propiedades/${propiedadId}/zonas`, {
      statusCode: 201,
      body: { id: 10, nombre_zona: 'COCINA', descripcion: 'Zona principal' }
    }).as('crearZona');

    cy.visit(`/propiedades/${propiedadId}/zona/crear`, {
      onBeforeLoad(win) {
        win.sessionStorage.setItem('token', 'token-prueba');
      }
    });

    cy.wait('@zonasPosibles');
  });

  it('muestra validación de requerido en zona', () => {
    cy.contains('button', 'Crear').should('be.disabled');
    cy.get('#nombre_zona').focus().blur();
    cy.contains('Contenido requerido').should('be.visible');
  });

  it('envía nombre_zona y descripcion al crear', () => {
    cy.get('#nombre_zona').select('COCINA');
    cy.get('#descripcion').type('Zona principal');
    cy.contains('button', 'Crear').click();

    cy.wait('@crearZona').its('request.body').should((body) => {
      expect(body).to.include({
        nombre_zona: 'COCINA',
        descripcion: 'Zona principal'
      });
    });
  });
});
