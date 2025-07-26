// Cypress.Commands.add("login", (email = "test@example.com", password = "password123") => {
//     const cy = Cypress.cy
//     cy.visit("https://vps-3696213-x.dattaweb.com/auth/login")
//     cy.get('[data-cy="email-input"]').type(email)
//     cy.get('[data-cy="password-input"]').type(password)
//     cy.get('[data-cy="login-button"]').click()
//     cy.url().should("not.include", "/auth/login")
// })

Cypress.Commands.add("login", (email = "test@example.com", password = "password123") => {
  cy.visit("https://vps-3696213-x.dattaweb.com/auth/login");

  cy.get('[data-cy="input-email"]').type(email);
  cy.get('[data-cy="input-password"]').type(password);
  cy.get('[data-cy="btn-login"]').click();

  cy.url().should("not.include", "/auth/login");
});

Cypress.Commands.add("logout", () => {
    const cy = Cypress.cy
    cy.get('[data-cy="user-menu"]').click()
    cy.get('[data-cy="logout-button"]').click()
    cy.url().should("include", "/")
})

Cypress.Commands.add("searchEvents", (searchTerm) => {
    const cy = Cypress.cy
    cy.get('input[placeholder="Busca tu próxima función!"]').clear().type(searchTerm)
    cy.get('input[placeholder="Busca tu próxima función!"]').type("{enter}")
})

Cypress.Commands.add("selectCategory", (category) => {
    const cy = Cypress.cy
    cy.get('span[data-slot="value"]').contains("Categoría").click()
    cy.get('span[data-label="true"]').contains(`${category}`).click()
})

Cypress.Commands.add("selectProvince", (province) => {
    const cy = Cypress.cy
    cy.get('button[aria-label="Provincia"]').click()
    cy.get(`[data-value="${province}"]`).click()
})

Cypress.Commands.add("clearFilters", () => {
    const cy = Cypress.cy
    cy.get("button").contains("Limpiar filtros").click()
})
