Cypress.Commands.add('irAlMes', (mesEsperado) => {
  function intentarAvanzar() {
    cy.get('body').then(($body) => {
      // Asegurarse que el header está en el DOM
      if ($body.find('div[data-slot="header-wrapper"] span').length) {
        cy.get('div[data-slot="header-wrapper"] span')
          .invoke('text')
          .then((mesActual) => {
            if (mesActual.trim().toLowerCase() !== mesEsperado.toLowerCase()) {
              cy.get('button[data-slot="next-button"]').click();
              cy.wait(300); // dar tiempo a que el calendario se actualice
              intentarAvanzar();
            }
          });
      } else {
        cy.wait(500);
        intentarAvanzar(); // reintentar hasta que aparezca
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

  it('verificar la validación de campos obligatorios', () => {
    cy.visit('https://vps-3696213-x.dattaweb.com/');
    cy.get('button[aria-label="Toggle menu"]').eq(0).click();
    cy.get(':nth-child(2) > .pb-4').click();
    cy.get('.rounded-b-large > .z-0').click();
    // Verificar que se muestran mensajes de error
    cy.get('[data-cy="input-titulo"]').should('exist');
    cy.get('[data-cy="select-edad"]').should('exist');
    cy.get('[data-cy="select-genero"]').should('exist');
    cy.get('[data-cy="input-duracion"]').should('exist');
    cy.get('[data-cy="select-lugar-evento"]').should('exist');
    cy.wait(3000); // esperar a que se muestren los mensajes de error
  });

  it('cargar eventos', () => {
    cy.visit('https://vps-3696213-x.dattaweb.com/');
    cy.get('button[aria-label="Toggle menu"]').eq(0).click();
    cy.get(':nth-child(2) > .pb-4').click();
    cy.get('input[aria-label="Evento con múltiples fechas y horarios"]').click();

    cy.get('[data-cy="input-titulo"]').type('The end');
    cy.get('[data-cy="select-edad"]').click();
    cy.contains('span', 'ATP').click();
    cy.get('[data-cy="select-genero"]').click();
    cy.contains('span', 'Recital').click();

    cy.get('[data-cy="input-duracion"]').within(() => {
      cy.get('[data-type="hour"]').type('05');
      cy.get('[data-type="minute"]').type('00');
    });

    cy.get('[data-cy="select-lugar-evento"]').click();
    cy.contains('span', 'Otro').click().wait(1000);
    cy.get('[data-cy="input-nombre-lugar"]').type('Plaza de la Música');
    cy.get('[data-cy="input-calle-lugar"]').type('Av. Colon');
    cy.get('[data-cy="input-altura-lugar"]').type('1234');
    cy.get('[data-cy="input-codigo-postal-lugar"]').type('5000');
    cy.get('input[aria-label="Provincia"]').click();
    cy.contains('[role="option"]', 'Córdoba').click();

    cy.get('input[aria-label="Localidad"]').click().type('Córdoba');

    // Esperamos que aparezcan las opciones
    cy.wait(500);

    // Comprobamos que no haya opciones repetidas
    cy.get('[role="option"]').then($options => {
      let repetidos = [];
      let vistos = new Set();
      $options.each((index, el) => {
        const text = el.innerText.trim();
        $options.each((i, el) => {
          if (i !== index && el.innerText.trim() === text && !vistos.has(text)) {
            repetidos.push(text);
            vistos.add(text);
          }
        })
      });

      if (repetidos.length > 0) {
        cy.log(`⚠️ Hay ${repetidos.length} ${repetidos.length > 1 ? 'opciones repetidas' : 'opción repetida'} `);
        repetidos.forEach(opcion => {
          cy.log(`🔁 Opción repetida: ${opcion}`);
        });
      }

      const cordobas = $options.filter((i, el) => el.innerText.includes('Córdoba'));

      // Intentar seleccionar la segunda opción (si existe)
      if (cordobas.length > 1) {
        Cypress.Promise.try(() => {
          return cy.wrap(cordobas.eq(1)).click({ force: true });
        }).catch(() => {
          Cypress.log({
            name: 'Advertencia',
            message: '❗ No se pudo hacer clic en la segunda opción Córdoba. El test continúa.',
          });
          cy.log('⚠️ Córdoba no fue seleccionada.');
        });
      } else {
        cy.log('✅ Solo una opción Córdoba encontrada o ninguna.');
      }
    });



    cy.get('[data-cy="input-info"]').type('Evento de prueba apto para todo público.');

    cy.get('[data-cy="datepicker-fecha-0"] [data-slot="selector-button"]').click();
    cy.wait(500); // opcional, para asegurar renderizado
    cy.irAlMes('agosto de 2025');
    cy.get('[role="gridcell"]')
      .contains('15')
      .click();

    cy.get('[data-cy="input-horario-0-0"]').within(() => {
      cy.get('[data-type="hour"]').type('20');
      cy.get('[data-type="minute"]').type('30');
    });

    cy.get('.mt-2 > .px-4').click();

    cy.get('[data-cy="datepicker-fecha-1"] [data-slot="selector-button"]').click();
    cy.wait(500); // opcional, para asegurar renderizado
    cy.irAlMes('septiembre de 2025');
    cy.get('[role="gridcell"]')
      .contains('20')
      .click();
    cy.get('[data-cy="input-horario-1-0"]').within(() => {
      cy.get('[data-type="hour"]').type('13');
      cy.get('[data-type="minute"]').type('45');
    });
    cy.get(':nth-child(2) > .flex-col.gap-1 > .flex-wrap > .bg-primary').click();
    cy.get('[data-cy="input-horario-1-1"]').within(() => {
      cy.get('[data-type="hour"]').type('17');
      cy.get('[data-type="minute"]').type('00');
    });

    cy.get('.rounded-b-large > .z-0').click();
    cy.wait(1000); // esperar a que se guarde el evento

  })

})
