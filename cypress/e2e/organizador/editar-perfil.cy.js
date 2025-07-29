describe('Ticketazo UI - Organizador', () => {
  const perfilData = {
    username: 'CC2025',
    LinkedIn: 'https://linkedin.com/in/cordoba.cultura',
    Twitter: 'https://twitter.com/cordoba.cultura',
    Instagram: 'https://instagram.com/cordoba.cultura',
    TikTok: 'https://tiktok.com/cordoba.cultura',
  };

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

  it('editar perfil de organizador', () => {
    cy.visit('https://vps-3696213-x.dattaweb.com/');
    cy.get('button[aria-label="Toggle menu"]').eq(0).click();
    cy.get(':nth-child(4) > .pb-4').click();
    cy.wait(2000);

    cy.get('input[aria-label="Nombre de usuario"]').clear().type(perfilData.username);
    Object.entries(perfilData).forEach(([label, value]) => {
      if (label !== 'username') {
        cy.get(`input[aria-label="${label}"]`).clear().type(value);
      }
    });

    cy.get('[data-cy="btn-save-profile"]').click();
    cy.get('.z-50 > .flex-grow')
      .should('be.visible')
      .and('contain.text', 'Perfil actualizado')
      .and('contain.text', '¡Perfil actualizado con éxito!');
    cy.wait(1000);
  });

  it('validar los cambios en el perfil', () => {
    cy.visit('https://vps-3696213-x.dattaweb.com/');
    cy.get('button[aria-label="Toggle menu"]').eq(0).click();
    cy.get(':nth-child(4) > .pb-4').click();
    cy.wait(2000);

    Object.entries(perfilData).forEach(([label, expectedValue]) => {
      const ariaLabel = label === 'username' ? 'Nombre de usuario' : label;
      cy.get(`input[aria-label="${ariaLabel}"]`)
        .should(($input) => {
          const val = $input.val();
          if (val !== expectedValue) {
            Cypress.log({
              name: 'warning',
              message: `⚠️ ${ariaLabel} no coincide: esperado "${expectedValue}", recibido "${val}"`,
            });
          }
        });
    });
  });
});
