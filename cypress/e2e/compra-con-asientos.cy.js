describe("Flujo de compra - Selección de butacas", () => {
    beforeEach(() => {
        cy.session("login-session", () => {
            cy.login("sofia88837utn@gmail.com", "Lupehermosa10/");
        });

        cy.visit("https://vps-3696213-x.dattaweb.com/compra/Grido%20Tech%20Advance?horario=26");
        cy.get('img[alt="Cargando..."]', { timeout: 30000 }).should('not.exist');
    });

    it("Carga correctamente la sección de sectores", () => {
        cy.contains("Reserva - Grido Tech Advance").should("be.visible");
        cy.contains("Mapa de Sectores").should("be.visible");
        cy.contains("Auditorio").should("be.visible");
    });

    it("Permite ingresar al Auditorio y ver las butacas", () => {
        cy.contains("Auditorio").click();
        cy.contains("Sector: Auditorio").should("be.visible");
        cy.contains("Asientos seleccionados: 0").should("be.visible");
        cy.contains("Disponibles:").should("be.visible");
    });

    it("Permite seleccionar una butaca disponible", () => {
        cy.contains("Auditorio").click();

        // Espera a que cargue la sección de butacas
        cy.contains("Asientos seleccionados: 0", { timeout: 10000 }).should("be.visible");

        // Click directo en una butaca conocida
        cy.get('button[title="Fila 13, Columna 1"]').click({ force: true });

        // Validar que se seleccionó correctamente
        cy.get('div.text-sm.text-gray-600', { timeout: 10000 })
            .should("contain.text", "Asientos seleccionados: 1");
    });

    it("Muestra error si se seleccionan más de 4 butacas", () => {
        cy.contains("Auditorio").click();

        cy.contains("Asientos seleccionados: 0", { timeout: 10000 }).should("be.visible");

        // Seleccionar 5 butacas
        const butacas = [
            'button[title="Fila 12, Columna 1"]',
            'button[title="Fila 12, Columna 2"]',
            'button[title="Fila 12, Columna 3"]',
            'button[title="Fila 12, Columna 4"]',
            'button[title="Fila 12, Columna 5"]' // Esta debería disparar el error
        ];

        butacas.forEach(selector => {
            cy.get(selector).click({ force: true });
        });

        // Verificar mensaje rojo
        cy.contains("No puedes seleccionar más de 4 asientos por persona.").should("be.visible");

        // Verificar contador
        cy.contains("Asientos seleccionados: 4").should("be.visible"); // Se mantiene en 4
    });

});
