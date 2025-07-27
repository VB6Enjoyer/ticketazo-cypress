describe('Ticketazo UI', () => {
    beforeEach(() => {
        // Preservar el estado de login entre tests
        cy.session('admin-session', () => {
            cy.visit('https://vps-3696213-x.dattaweb.com/auth/login');
            cy.get('input[type="email"]').type('admin@admin.com');
            cy.get('input[type="password"]').type('admin');
            cy.get('[data-cy="btn-login"]').click();
            cy.url().should('not.include', '/auth/login');
        });
    });

    it('should login successfully', () => {
        cy.visit('https://vps-3696213-x.dattaweb.com/');
        cy.url().should('include', 'vps-3696213-x.dattaweb.com');
        cy.get('body').should('not.contain', 'Invalid credentials');
    });

    it('aprobar un organizador pendiente', () => {
        cy.visit('https://vps-3696213-x.dattaweb.com/');
        // Click en el botón del menú
        cy.get('button[aria-label="Toggle menu"]').click();
        
        // Click en AdminClientes dentro del menú
        cy.get(':nth-child(8) > .pb-4').click();
        
        // Click en filtro Pendiente
        cy.get('[data-cy="btn-filtro-pendiente"]').click();
        
        // Seleccionar el primer cliente y aprobar
        cy.get('[data-cy^="select-estado-"]').first().click();
        cy.get('[id$="-option-Aprobado"]').contains('Aprobado').click();
        cy.get('[data-cy="btn-confirmar-modal"]').click();
        
        // Verificar cambio
        cy.get('[data-cy="btn-filtro-aprobado"]').click();
        cy.get('[data-cy^="select-estado-"]').first()
          .should('contain.text', 'Aprobado');
    });
});

