describe('Elemento Zona - crear', () => {
  const propiedadId = 1;

  beforeEach(() => {
    cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, {
      statusCode: 200,
      body: [
        { id: 5, nombre_zona: 'COCINA' },
        { id: 6, nombre_zona: 'SALA' }
      ]
    }).as('zonasPropiedad');

    cy.intercept('POST', '**/zonas/*/elementos', {
      statusCode: 201,
      body: { id: 50 }
    }).as('crearElementoZona');

    cy.visit(`/propiedades/${propiedadId}/elemento-zona/crear`, {
      onBeforeLoad(win) {
        win.sessionStorage.setItem('token', 'token-prueba');
      }
    });

    cy.wait('@zonasPropiedad');
  });

  it('requiere fecha_registro para habilitar crear', () => {
    cy.get('#id_zona').select('COCINA');
    cy.get('#nombre_elemento').type('Horno Microondas');
    cy.get('#cantidad').clear().type('1');
    cy.contains('button', 'Crear').should('be.disabled');

    cy.get('#fecha_registro').focus().blur();
    cy.contains('Contenido requerido').should('be.visible');
  });

  it('envía payload esperado por backend', () => {
    cy.get('#id_zona').select('COCINA');
    cy.get('#nombre_elemento').type('Horno Microondas');
    cy.get('#descripcion').type('Elemento de cocina');
    cy.get('#cantidad').clear().type('1');
    cy.get('#fecha_registro').type('2023-01-06T15:00');

    cy.contains('button', 'Crear').click();

    cy.wait('@crearElementoZona').then(({ request }) => {
      const expectedIsoDate = new Date('2023-01-06T15:00').toISOString();

      expect(request.url).to.match(/\/zonas\/5\/elementos$/);
      expect(request.body).to.include({
        nombre_elemento: 'Horno Microondas',
        descripcion: 'Elemento de cocina',
        cantidad: 1
      });
      expect(request.body.fecha_registro).to.eq(expectedIsoDate);
      expect(request.body).to.not.have.property('id_zona');
    });
  });
});
