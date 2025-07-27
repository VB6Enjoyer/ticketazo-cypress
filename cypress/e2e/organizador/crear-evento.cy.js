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

describe('Ticketazo UI', () => {
  beforeEach(() => {
    cy.session('admin-session', () => {
      cy.visit('https://vps-3696213-x.dattaweb.com/auth/login');
      cy.get('input[type="email"]').type('agustinarufinoc@gmail.com');
      cy.get('input[type="password"]').type('Nala2301$');
      cy.get('[data-cy="btn-login"]').click();
      cy.url().should('not.include', '/auth/login');
    });
  });

  it('cargar eventos', () => {
    cy.visit('https://vps-3696213-x.dattaweb.com/');
    cy.get('button[aria-label="Toggle menu"]').click();
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
    cy.contains('span', 'Cordoba Cultura').click();
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

    })
})
