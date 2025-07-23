describe("Página de login", () => {
  beforeEach(() => {
    cy.viewport(1280, 800); // Asegura que se vean todos los elementos necesarios para el testeo
    cy.visit("https://vps-3696213-x.dattaweb.com/auth/login"); // Recarga la página antes de cada test
    cy.get('img[alt="Cargando..."]', { timeout: 30000 }).should('not.exist'); // Se asegura de que la pagina cargó
  });

  describe("Login", () => {
    // TODO
    it.skip("Login funciona", () => {
      // Llenar formulario de login (cambiar por credenciales correctas)
      cy.get('[data-cy="input-email"]').type("test@example.com");
      cy.get('[data-cy="input-password"]').type("password123");
      cy.get('[data-cy="btn-login"]').click();

      // Verificar si el login funcionó
      cy.url().should("not.include", "/auth/login");
      // TODO Acá debería ir alguna clase de verificación adicional del funcionamiento del login
    });

    it.skip("Login tira error", () => {
      // Escuchar para interceptar el error de autenticación
      cy.intercept("POST", "/api/backend/auth/login", {
        statusCode: 401,
        body: { error: "Correo o contraseña incorrectos" },
      }).as("loginError");

      // Loguearse con datos erroneos
      cy.get('[data-cy="input-email"]').type("emailfalso@fakemail.com");
      cy.get('[data-cy="input-password"]').type("passfalsa");
      cy.get('[data-cy="btn-login"]').click();

      // Verificar error de login
      cy.wait("@loginError");
      //cy.contains('p', 'Correo o contraseña incorrectos', { timeout: 10000 }); <- Esto se puede usar para testear sin interceptar el POST
    });

    it.skip("Validar campos", () => {
      // Tratar de loguearse sin ingresar datos
      cy.get('[data-cy="btn-login"]').click();
      cy.contains('p', 'Correo o contraseña incorrectos', { timeout: 10000 });

      // Constantes para no usar tantos gets
      const emailInput = cy.get('[data-cy="input-email"]');
      const passwordInput = cy.get('[data-cy="input-password"]');

      // Validar que el email sea válido
      emailInput.type("test");
      emailInput.blur();
      cy.get('div').contains('Incluye un signo "@" en la dirección de correo electrónico. La dirección "test" no incluye el signo "@".');
      //cy.get('[data-slot="error-message"]').should('be.visible').and('contain', 'Ingrese una dirección de correo electrónico.'); <- Esto se muestra al testear manual, pero no aparece al testear en Cypress.

      // Validar que se hayan escrito un email y contraseña (esto es un desastre porque el sitio es inconsistente en como muestra los errores)
      emailInput.clear();
      passwordInput.type("passfalsa");
      cy.get('[data-slot="error-message"]').should('be.visible').and('contain', 'Completa este campo');
      passwordInput.blur();
      emailInput.type("test@gmail.com");
      passwordInput.clear();
      passwordInput.blur();
      emailInput.type("test");
      cy.get('[data-slot="error-message"]').should('be.visible').and('contain', 'Completa este campo');
    });
  });

  describe("Manejo de sesión", () => {
    it.skip("Mantiene sesión al refrescar la página", () => {
      // TODO
    });

    it.skip("Rutas protegidas redireccionan a pantalla de login", () => {
      // TODO
    });
  })
});
