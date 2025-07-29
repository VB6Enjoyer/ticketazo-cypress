// Comando para navegar al mes deseado
Cypress.Commands.add('irAlMes', (mesEsperado) => {
  function intentarAvanzar() {
    cy.get('body').then(($body) => {
      if ($body.find('div[data-slot="header-wrapper"] span').length) {
        cy.get('div[data-slot="header-wrapper"] span')
          .invoke('text')
          .then((mesActual) => {
            if (mesActual.trim().toLowerCase() !== mesEsperado.toLowerCase()) {
              cy.get('button[data-slot="next-button"]').click();
              cy.wait(300);
              intentarAvanzar();
            }
          });
      } else {
        cy.wait(500);
        intentarAvanzar();
      }
    });
  }

  intentarAvanzar();
});

Cypress.Commands.add('seleccionarFecha', (labelCompleto) => {
  cy.get(`[aria-label="${labelCompleto}"]`, { timeout: 10000 })
    .should('exist')
    .click();
});

const evento = {
  titulo: 'The end',
  edad: 'ATP',
  genero: 'Recital',
  duracion: { hora: '05', minuto: '00' },
  lugar: {
    nombre: 'Plaza de la Música',
    calle: 'Av. Colon',
    altura: '1234',
    codigoPostal: '5000',
    provincia: 'Córdoba',
    localidad: 'Córdoba'
  },
  info: 'Evento de prueba apto para todo público.',
  fechas: [
    {
      mes: 'agosto de 2025',
      dia: '15',
      horarios: [{ hora: '20', minuto: '30' }]
    },
    {
      mes: 'septiembre de 2025',
      dia: '20',
      horarios: [
        { hora: '13', minuto: '45' },
        { hora: '17', minuto: '00' }
      ]
    }
  ]
};

describe('Ticketazo UI - Organizador', () => {
  beforeEach(() => {
    cy.session('organizador-session', () => {
      const organizador = Cypress.env('organizador');

      if (!organizador) {
        throw new Error('No se encontraron las credenciales del usuario organizador en cypress.env.json');
      }

      cy.visit('https://vps-3696213-x.dattaweb.com/auth/login');
      cy.get('[data-cy="input-email"]').type(organizador.email);
      cy.get('[data-cy="input-password"]').type(organizador.password);
      cy.get('[data-cy="btn-login"]').click();
      cy.url().should('not.include', '/auth/login');
    });
  });

  it('cargar eventos', () => {
    cy.visit('https://vps-3696213-x.dattaweb.com/');
    cy.get('button[aria-label="Toggle menu"]').eq(0).click();
    cy.get(':nth-child(2) > .pb-4').click();
    cy.get('input[aria-label="Evento con múltiples fechas y horarios"]').click();

    cy.get('[data-cy="input-titulo"]').type(evento.titulo);
    cy.get('[data-cy="select-edad"]').click();
    cy.contains('span', evento.edad).click();
    cy.get('[data-cy="select-genero"]').click();
    cy.contains('span', evento.genero).click();

    cy.get('[data-cy="input-duracion"]').within(() => {
      cy.get('[data-type="hour"]').type(evento.duracion.hora);
      cy.get('[data-type="minute"]').type(evento.duracion.minuto);
    });

    cy.get('[data-cy="select-lugar-evento"]').click();
    cy.contains('span', 'Otro').click().wait(1000);
    cy.get('[data-cy="input-nombre-lugar"]').type(evento.lugar.nombre);
    cy.get('[data-cy="input-calle-lugar"]').type(evento.lugar.calle);
    cy.get('[data-cy="input-altura-lugar"]').type(evento.lugar.altura);
    cy.get('[data-cy="input-codigo-postal-lugar"]').type(evento.lugar.codigoPostal);
    cy.get('input[aria-label="Provincia"]').click();
    cy.contains('[role="option"]', evento.lugar.provincia).click();
    cy.get('input[aria-label="Localidad"]').click().type(evento.lugar.localidad);


    cy.wait(500);
    cy.get('[role="option"]').then(($options) => {
      const coincidencias = $options.filter((i, el) =>
        el.innerText.trim().includes(evento.lugar.localidad)
      );

      if (coincidencias.length > 1) {
        Cypress.Promise.try(() => {
          return cy.wrap(coincidencias.eq(1)).click({ force: true });
        }).catch(() => {
          Cypress.log({
            name: 'Advertencia',
            message: `❗ No se pudo hacer clic en la segunda opción "${evento.lugar.localidad}". El test continúa.`,
          });
          cy.log(`⚠️ "${evento.lugar.localidad}" no fue seleccionada correctamente.`);
        });
      } else if (coincidencias.length === 1) {
        cy.wrap(coincidencias.eq(0)).click({ force: true });
        cy.log(`✅ Opción "${evento.lugar.localidad}" seleccionada.`);
      } else {
        cy.log(`❌ No se encontró ninguna opción que contenga: "${evento.lugar.localidad}".`);
      }
    });

    cy.get('[data-cy="input-info"]').type(evento.info);

    evento.fechas.forEach((fecha, index) => {
      cy.get(`[data-cy="datepicker-fecha-${index}"] [data-slot="selector-button"]`).click();
      cy.wait(500);
      cy.irAlMes(fecha.mes);
      cy.get('[role="gridcell"]').contains(fecha.dia).click();

      fecha.horarios.forEach((horario, idx) => {
        cy.get(`[data-cy="input-horario-${index}-${idx}"]`).within(() => {
          cy.get('[data-type="hour"]').type(horario.hora);
          cy.get('[data-type="minute"]').type(horario.minuto);
        });

        // Solo hacer clic en el botón "Agregar nuevo horario" si hay más horarios
        if (idx < fecha.horarios.length - 1) {
          cy.get(`:nth-child(${index + 1}) > .flex-col.gap-1 > .flex-wrap > .bg-primary`).click();
        }
      });

      // Solo hacer clic en "Agregar otra fecha" si hay más fechas
      if (index < evento.fechas.length - 1) {
        cy.get('.mt-2 > .px-4').click();
      }
    });

    cy.get('.rounded-b-large > .z-0').click();
    cy.wait(1000);
  });
});

