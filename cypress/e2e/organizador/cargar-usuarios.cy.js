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



    it('gestionar usuarios', () => {
        cy.visit('https://vps-3696213-x.dattaweb.com/');
        cy.get('button[aria-label="Toggle menu"]').eq(0).click();
        cy.get(':nth-child(4) > .pb-4').click();
        cy.wait(2000);

        //cy.get('input[aria-label="Nombre de usuario"]').clear().type('CC2025');
        cy.get('input[aria-label="Correo electrónico"]').clear().type('useraut3@example.com');
        cy.get('input[aria-label="Nombre"]').eq(1).clear().type('Autorizado 3');
        cy.get('input[aria-label="numero de telefono"]').clear().type('3519876543');
        cy.get('button').contains(/^Cargar$/).click();
        cy.get('div.flex.flex-grow.flex-row.gap-x-4.items-center.relative')
            .then(($el) => {
                const texto = $el.text().trim();
                if (texto.includes('Usuario autorizado')) {
                    cy.log('Usuario autorizado correctamente');
                } else {
                    cy.log('No se pudo autorizar al usuario');
                }

            });
    })

    it('validar usuario cargado', () => {
        cy.visit('https://vps-3696213-x.dattaweb.com/');
        cy.get('button[aria-label="Toggle menu"]').eq(0).click();
        cy.get(':nth-child(4) > .pb-4').click();
        cy.wait(2000);

        cy.get('tr[data-cy^="row-usuario-"]', { timeout: 10000 }).should('exist');

        cy.get('tr[data-cy^="row-usuario-"]').then(($rows) => {
            const encontrado = Array.from($rows).some((row) => {
                return Cypress.$(row).find('td').eq(1).text().trim().toLowerCase().includes('cordoba cultura');
            });

            expect(encontrado, 'Nombre Cordoba Cultura encontrado en la tabla').to.be.true;
        });

    });
})
