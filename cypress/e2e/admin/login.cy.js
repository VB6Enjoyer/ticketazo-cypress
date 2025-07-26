describe('Ticketazo UI', () => {
    it('should visit homepage', () => {
        cy.visit('https://vps-3696213-x.dattaweb.com/');
        cy.url().should('include', 'vps-3696213-x.dattaweb.com');
    });
});

describe("Login", () => {
    it('should navigate to login page and login successfully', () => {
        cy.visit('https://vps-3696213-x.dattaweb.com/auth/login');
        cy.url().should('include', '/auth/login');
        
        // Ingresar credenciales
        cy.get('input[type="email"]').type('admin@admin.com');
        cy.get('input[type="password"]').type('admin');
        
        // Click en botón login
        cy.get('[data-cy="btn-login"]').click();
        
        // Verificar login exitoso
        cy.url().should('not.include', '/auth/login');
        cy.get('body').should('not.contain', 'Invalid credentials');
    });
});
