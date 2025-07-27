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

    it('editar perfil de organizador', () => {
        cy.visit('https://vps-3696213-x.dattaweb.com/');
        cy.get('button[aria-label="Toggle menu"]').eq(0).click();
        cy.get(':nth-child(4) > .pb-4').click();
        cy.wait(2000); // esperar a que se cargue la página de perfil

        cy.get('input[aria-label="Nombre de usuario"]').clear().type('CC2025');
        cy.get('input[aria-label="LinkedIn"]').clear().type('https://linkedin.com/in/cc2025');
        cy.get('input[aria-label="Twitter"]').clear().type('https://twitter.com/cc2025');
        cy.get('input[aria-label="Instagram"]').clear().type('https://instagram.com/cc2025');
        cy.get('input[aria-label="TikTok"]').clear().type('https://tiktok.com/cc2025');
        cy.get('[data-cy="btn-save-profile"]').click();
        cy.get('.z-50 > .flex-grow')
            .should('be.visible')
            .and('contain.text', 'Perfil actualizado')
            .and('contain.text', '¡Perfil actualizado con éxito!');
    });

})