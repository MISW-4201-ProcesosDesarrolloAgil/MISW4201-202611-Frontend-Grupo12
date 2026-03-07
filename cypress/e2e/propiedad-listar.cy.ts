describe('Propiedad - listar', () => {
  const propiedadesMock = [
    {
      id: 1,
      nombre_propiedad: 'Apto Centro',
      estado: 'ACTIVA'
    },
    {
      id: 2,
      nombre_propiedad: 'Casa Norte',
      estado: 'INACTIVA'
    }
  ];

  beforeEach(() => {
    cy.intercept('GET', /^http:\/\/(127\.0\.0\.1|localhost):8080\/propiedades\/?(\?.*)?$/, {
      statusCode: 200,
      body: propiedadesMock
    }).as('getPropiedades');

    cy.visit('/propiedades', {
      onBeforeLoad(win) {
        win.sessionStorage.setItem('token', 'token-prueba');
      }
    });

    cy.wait('@getPropiedades');
  });

  it('muestra columnas clave y la grilla de propiedades', () => {
    cy.contains('th', 'Nombre').should('be.visible');
    cy.contains('th', 'Estado').should('be.visible');
    cy.get('table tbody tr').should('have.length', 2);
    cy.contains('table tbody tr', 'Apto Centro').should('be.visible');
    cy.contains('table tbody tr', 'Casa Norte').should('be.visible');
  });

  it('muestra estado y boton ver detalle por fila', () => {
    cy.contains('table tbody tr', 'Apto Centro').within(() => {
      cy.contains('.badge-estado', 'Activa').should('be.visible');
      cy.contains('button', 'Ver detalle').should('be.visible');
    });

    cy.contains('table tbody tr', 'Casa Norte').within(() => {
      cy.contains('.badge-estado', 'Inactiva').should('be.visible');
      cy.contains('button', 'Ver detalle').should('be.visible');
    });
  });
});
