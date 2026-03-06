describe('Propiedad - Detalle', () => {
  const propiedadId = 1;

  const propiedadMock = {
    id: propiedadId,
    nombre_propiedad: 'Casa de Playa',
    ciudad: 'Cartagena',
    municipio: 'Bocagrande',
    direccion: 'Calle 5 # 10-20',
    nombre_propietario: 'Juan Pérez',
    numero_contacto: '3001234567',
    banco: 'Bancolombia',
    numero_cuenta: '12345678'
  };

  const reservaFuturaMock = {
    id: 1,
    nombre: 'Carlos López',
    fecha_ingreso: new Date(Date.now() + 86400000 * 5).toISOString(),
    fecha_salida: new Date(Date.now() + 86400000 * 10).toISOString(),
    plataforma_reserva: 'Airbnb',
    total_reserva: 500000,
    comision: 50000,
    id_propiedad: propiedadId,
    numero_personas: 2,
    observaciones: ''
  };

  const reservaPasadaMock = {
    id: 2,
    nombre: 'María García',
    fecha_ingreso: new Date(Date.now() - 86400000 * 20).toISOString(),
    fecha_salida: new Date(Date.now() - 86400000 * 10).toISOString(),
    plataforma_reserva: 'Booking',
    total_reserva: 300000,
    comision: 30000,
    id_propiedad: propiedadId,
    numero_personas: 3,
    observaciones: ''
  };

  const zonaMock = { id: 10, nombre_zona: 'COCINA', descripcion: 'Cocina principal' };

  const elementosMock = [
    { id: 100, nombre_elemento: 'Estufa', descripcion: '4 puestos', cantidad: 1 },
    { id: 101, nombre_elemento: 'Sillas', descripcion: '', cantidad: 4 }
  ];

  function visitarDetalle(overrideToken?: string) {
    cy.visit(`/propiedad/detalle/${propiedadId}`, {
      onBeforeLoad(win) {
        win.sessionStorage.setItem('token', overrideToken ?? 'token-prueba');
      }
    });
  }

  function interceptBase() {
    cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
    cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
    cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');
  }

  // ─── Información general de la propiedad ────────────────────────────────────

  describe('Información general', () => {
    beforeEach(() => {
      interceptBase();
      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);
    });

    it('muestra el nombre de la propiedad como título', () => {
      cy.get('h1.propiedad-nombre').should('contain.text', propiedadMock.nombre_propiedad);
    });

    it('muestra la dirección, municipio y ciudad en el encabezado', () => {
      cy.get('p.propiedad-direccion').should('contain.text', propiedadMock.direccion)
        .and('contain.text', propiedadMock.municipio)
        .and('contain.text', propiedadMock.ciudad);
    });

    it('muestra el badge "Activa"', () => {
      cy.get('.badge-estado.activa').should('contain.text', 'Activa');
    });

    it('muestra el propietario en la sección de información', () => {
      cy.contains('.info-label', 'Propietario')
        .siblings('.info-value')
        .should('contain.text', propiedadMock.nombre_propietario);
    });

    it('muestra el número de contacto', () => {
      cy.contains('.info-label', 'Contacto')
        .siblings('.info-value')
        .should('contain.text', propiedadMock.numero_contacto);
    });

    it('muestra la ciudad en el grid de información', () => {
      cy.contains('.info-label', 'Ciudad')
        .siblings('.info-value')
        .should('contain.text', propiedadMock.ciudad);
    });

    it('muestra el municipio en el grid de información', () => {
      cy.contains('.info-label', 'Municipio')
        .siblings('.info-value')
        .should('contain.text', propiedadMock.municipio);
    });

    it('muestra el banco cuando está presente', () => {
      cy.contains('.info-label', 'Banco')
        .siblings('.info-value')
        .should('contain.text', propiedadMock.banco);
    });

    it('muestra el número de cuenta cuando está presente', () => {
      cy.contains('.info-label', 'Número de cuenta')
        .siblings('.info-value')
        .should('contain.text', propiedadMock.numero_cuenta);
    });
  });

  // ─── Estado de carga ─────────────────────────────────────────────────────────

  describe('Estado de carga', () => {
    it('muestra el mensaje de carga mientras se obtiene la propiedad', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, (req) => {
        req.on('response', (res) => { res.setDelay(500); });
        req.reply(propiedadMock);
      }).as('getPropiedadLento');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();

      cy.contains('Cargando información de la propiedad').should('be.visible');
      cy.wait('@getPropiedadLento');
      cy.contains('Cargando información de la propiedad').should('not.exist');
    });
  });

  // ─── Estado de error ─────────────────────────────────────────────────────────

  describe('Estado de error', () => {
    it('muestra un mensaje de error cuando el API falla', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, { statusCode: 500, body: {} }).as('getPropiedadError');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();
      cy.wait('@getPropiedadError');

      cy.contains('No se pudo cargar la información de la propiedad').should('be.visible');
    });

    it('no muestra el contenido principal cuando hay error', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, { statusCode: 500, body: {} }).as('getPropiedadError');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();
      cy.wait('@getPropiedadError');

      cy.get('.propiedad-header').should('not.exist');
    });
  });

  // ─── Reservas ────────────────────────────────────────────────────────────────

  describe('Reservas', () => {
    it('muestra mensaje cuando no hay reservas', () => {
      interceptBase();
      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);

      cy.contains('No hay reservas registradas para esta propiedad').should('be.visible');
      cy.get('table.tabla-reservas').should('not.exist');
    });

    it('muestra la tabla de reservas cuando existen reservas', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, [reservaFuturaMock]).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);

      cy.get('table.tabla-reservas').should('be.visible');
      cy.get('table.tabla-reservas tbody tr').should('have.length', 1);
    });

    it('muestra el nombre del huésped en la tabla de reservas', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, [reservaFuturaMock]).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);

      cy.get('table.tabla-reservas tbody tr').first().should('contain.text', reservaFuturaMock.nombre);
    });

    it('muestra badge "Confirmada" para reserva futura', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, [reservaFuturaMock]).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);

      cy.get('table.tabla-reservas tbody tr').first()
        .find('.badge-reserva')
        .should('contain.text', 'Confirmada')
        .and('have.class', 'badge-confirmada');
    });

    it('muestra badge "Completada" para reserva pasada', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, [reservaPasadaMock]).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);

      cy.get('table.tabla-reservas tbody tr').first()
        .find('.badge-reserva')
        .should('contain.text', 'Completada')
        .and('have.class', 'badge-completada');
    });

    it('muestra badge "En curso" para reserva activa hoy', () => {
      const reservaEnCurso = {
        ...reservaFuturaMock,
        id: 3,
        nombre: 'Pedro Ruiz',
        fecha_ingreso: new Date(Date.now() - 86400000).toISOString(),
        fecha_salida: new Date(Date.now() + 86400000).toISOString()
      };

      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, [reservaEnCurso]).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);

      cy.get('table.tabla-reservas tbody tr').first()
        .find('.badge-reserva')
        .should('contain.text', 'En curso')
        .and('have.class', 'badge-en-curso');
    });

    it('muestra múltiples reservas en la tabla', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, [reservaFuturaMock, reservaPasadaMock]).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, []).as('getZonas');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);

      cy.get('table.tabla-reservas tbody tr').should('have.length', 2);
    });
  });

  // ─── Zonas e inventario ───────────────────────────────────────────────────────

  describe('Zonas e inventario', () => {
    it('muestra mensaje cuando no hay zonas', () => {
      interceptBase();
      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);

      cy.contains('No hay zonas registradas para esta propiedad').should('be.visible');
      cy.get('.zonas-grid').should('not.exist');
    });

    it('muestra la zona en el grid cuando existe', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, [zonaMock]).as('getZonas');
      cy.intercept('GET', `**/zonas/${zonaMock.id}/elementos`, elementosMock).as('getElementos');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas', '@getElementos']);

      cy.get('.zonas-grid').should('be.visible');
      cy.get('.zona-card').should('have.length', 1);
    });

    it('formatea el nombre de la zona correctamente (guiones bajos a espacios)', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, [zonaMock]).as('getZonas');
      cy.intercept('GET', `**/zonas/${zonaMock.id}/elementos`, []).as('getElementos');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas', '@getElementos']);

      cy.get('.zona-nombre').should('contain.text', 'COCINA');
    });

    it('muestra la descripción de la zona cuando existe', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, [zonaMock]).as('getZonas');
      cy.intercept('GET', `**/zonas/${zonaMock.id}/elementos`, []).as('getElementos');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas', '@getElementos']);

      cy.get('.zona-descripcion').should('contain.text', zonaMock.descripcion);
    });

    it('muestra el badge con el conteo de elementos de la zona', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, [zonaMock]).as('getZonas');
      cy.intercept('GET', `**/zonas/${zonaMock.id}/elementos`, elementosMock).as('getElementos');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas', '@getElementos']);

      cy.get('.zona-badge').should('contain.text', `${elementosMock.length} elementos`);
    });

    it('muestra la tabla de elementos dentro de una zona', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, [zonaMock]).as('getZonas');
      cy.intercept('GET', `**/zonas/${zonaMock.id}/elementos`, elementosMock).as('getElementos');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas', '@getElementos']);

      cy.get('.tabla-elementos tbody tr').should('have.length', elementosMock.length);
      cy.get('.tabla-elementos tbody tr').first().should('contain.text', elementosMock[0].nombre_elemento);
    });

    it('muestra la cantidad de cada elemento en la zona', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, [zonaMock]).as('getZonas');
      cy.intercept('GET', `**/zonas/${zonaMock.id}/elementos`, elementosMock).as('getElementos');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas', '@getElementos']);

      cy.get('.tabla-elementos tbody tr').first()
        .find('.cantidad-badge')
        .should('contain.text', String(elementosMock[0].cantidad));
    });

    it('muestra "Sin elementos registrados" cuando la zona no tiene elementos', () => {
      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, [zonaMock]).as('getZonas');
      cy.intercept('GET', `**/zonas/${zonaMock.id}/elementos`, []).as('getElementos');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas', '@getElementos']);

      cy.contains('Sin elementos registrados').should('be.visible');
      cy.get('.tabla-elementos').should('not.exist');
    });

    it('muestra "—" cuando la descripción del elemento está vacía', () => {
      const elementoSinDescripcion = [
        { id: 200, nombre_elemento: 'Sofá', descripcion: '', cantidad: 1 }
      ];

      cy.intercept('GET', `**/propiedades/${propiedadId}`, propiedadMock).as('getPropiedad');
      cy.intercept('GET', `**/propiedades/${propiedadId}/reservas`, []).as('getReservas');
      cy.intercept('GET', `**/propiedades/${propiedadId}/zonas`, [zonaMock]).as('getZonas');
      cy.intercept('GET', `**/zonas/${zonaMock.id}/elementos`, elementoSinDescripcion).as('getElementos');

      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas', '@getElementos']);

      cy.get('.tabla-elementos tbody tr').first().find('.col-descripcion').should('contain.text', '—');
    });
  });

  // ─── Navegación ──────────────────────────────────────────────────────────────

  describe('Navegación', () => {
    beforeEach(() => {
      interceptBase();
      visitarDetalle();
      cy.wait(['@getPropiedad', '@getReservas', '@getZonas']);
    });

    it('muestra el botón "Volver a mis propiedades"', () => {
      cy.get('button.volver-link').should('be.visible').and('contain.text', 'Volver a mis propiedades');
    });

    it('navega a /propiedades al hacer clic en volver', () => {
      cy.intercept('GET', '**/propiedades', [propiedadMock]).as('getPropiedades');
      cy.get('button.volver-link').click();
      cy.location('pathname').should('eq', '/propiedades');
    });
  });
});
