describe('Compra paga - Evento sin asientos (Coldplay)', () => {
    it('Permite seleccionar una entrada y llegar a pantalla de pago aprobado', () => {
        // 👉 Iniciar sesión si no existe
        cy.session("login-session", () => {
            cy.login("sofia88837utn@gmail.com", "Lupehermosa10/");
        });

        // 👉 Ingreso al evento sin asientos (Coldplay)
        cy.visit('https://vps-3696213-x.dattaweb.com/compra/Coldplay?horario=63');

        // 👉 Seleccionar 1 entrada en el sector "Campo"
        cy.contains('Campo')
            .parents('div')
            .find('button')
            .contains('+')
            .click();

        // 👉 Verificar total actualizado
        cy.contains('Total: $40000.00').should('be.visible');

        // 👉 Click en Continuar
        cy.contains('Continuar').click();

        // 👉 Validar resumen de compra
        cy.contains('Resumen de Compra').should('be.visible');
        cy.contains('Coldplay').should('exist');
        cy.contains('1 entrada Campo').should('exist');
        cy.contains('Precio base: $40000.00').should('be.visible');
        cy.contains('Comisión de servicio:').should('exist');

        // 👉 Aceptar términos y pagar
        cy.get('input[type="checkbox"]').check({ force: true });
        cy.contains(/^Pagar\s/).click();

        // 👉 Simular retorno desde MercadoPago (mockeado)
        cy.visit('https://vps-3696213-x.dattaweb.com/compra/aprobada');

        // ✅ Validar pantalla de éxito
        cy.contains('¡Pago Aprobado!').should('be.visible');
        cy.contains('Tu compra ha sido procesada exitosamente').should('be.visible');

        // 👉 Acceder a "Ver mis tickets"
        cy.contains('Ver mis tickets').click();
        cy.url().should('include', '/tickets/list');
    });
});
