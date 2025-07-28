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

    it('editar permisos a un usuario', () => {
        cy.visit('https://vps-3696213-x.dattaweb.com/');
        cy.get('button[aria-label="Toggle menu"]').eq(0).click();
        cy.get(':nth-child(4) > .pb-4').click();
        cy.wait(2000);
    
        cy.get('button[data-cy="btn-editar-permisos-0"]').click().wait(1000);
        cy.get(':nth-child(3) > .text-center > input').click();
        cy.get(':nth-child(4) > .text-center > input').click();
        cy.get(':nth-child(5) > .text-center > input').click();
        cy.get('.bg-white > .flex > .bg-primary').click();
        cy.get('.z-50 > .flex-grow')
            .should('be.visible')
            .and('contain.text', 'Permisos actualizado')
            .and('contain.text', 'Permisos actualizados correctamente.');
        cy.wait(2000)


        cy.get('button[data-cy="select-estado-0"]').click();
        cy.wait(300);
        cy.get('[role="listbox"]:visible [role="option"]')
            .contains('Aceptado')
            .first()
            .click();
        cy.get('.z-50 > .flex-grow')
            .should('be.visible')
            .and('contain.text', 'Estado actualizado')
            .and('contain.text', 'Estado actualizado correctamente.');
        cy.wait(1000); // esperar a que se muestre el mensaje de éxito

        cy.get('button[data-cy="select-estado-1"]').click();
        cy.wait(300);
        cy.get('[role="listbox"]:visible [role="option"]')
            .contains('Rechazado')
            .first()
            .click();
        cy.get('.z-50 > .flex-grow')
            .should('be.visible')
            .and('contain.text', 'Estado actualizado')
            .and('contain.text', 'Estado actualizado correctamente.');
        cy.wait(1000);

        cy.get('button[data-cy="select-estado-2"]').click();
        cy.wait(300);
        cy.get('[role="listbox"]:visible [role="option"]')
            .contains('Baja')
            .first()
            .click();
        cy.get('.z-50 > .flex-grow')
            .should('be.visible')
            .and('contain.text', 'Estado actualizado')
            .and('contain.text', 'Estado actualizado correctamente.');
        cy.wait(1000);

        cy.get('button[data-cy="select-estado-3"]').click();
        cy.wait(300);
        cy.get('[role="listbox"]:visible [role="option"]')
            .contains('Aceptado')
            .first()
            .click();
        cy.get('.z-50 > .flex-grow')
            .should('be.visible')
            .and('contain.text', 'Estado actualizado')
            .and('contain.text', 'Estado actualizado correctamente.');
        cy.wait(1000);
    })



})