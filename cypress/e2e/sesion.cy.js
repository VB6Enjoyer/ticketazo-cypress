describe("Persistencia de sesión", () => {
    beforeEach(() => {
        cy.viewport(1280, 800);
        // Usa cy.session para guardar cookies/localStorage y evitar repetir login
        cy.session("login-session", () => {
            cy.login("sofia88837utn@gmail.com", "Lupehermosa10/");
        });
    });

    it("Mantiene sesión iniciada al recargar la página", () => {
        cy.visit("https://vps-3696213-x.dattaweb.com/");
        cy.reload();
        cy.get("button").contains("Logout").should("be.visible");
    });

    it("Mantiene sesión iniciada al navegar a 'Mis entradas' y volver", () => {
        cy.visit("https://vps-3696213-x.dattaweb.com/");

        // Ir a Mis entradas
        cy.contains("Mis entradas").click();

        // Verifica que está en la página correcta
        cy.url().should("include", "/tickets/list");

        // Volver a home
        cy.go("back");

        // Verifica que sigue logueado (se ve el botón Logout)
        cy.get("button").contains("Logout").should("be.visible");
    });

    it("Cierra la sesión correctamente al hacer logout", () => {
        cy.visit("https://vps-3696213-x.dattaweb.com/");
        cy.get("button").contains("Logout").click();
        cy.get("button").contains("Login").should("be.visible");
    });
});