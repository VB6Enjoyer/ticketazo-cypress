describe("Home", () => {
  beforeEach(() => {
    cy.viewport(1280, 800); // Asegura que se vean todos los elementos necesarios para el testeo
    cy.visit("https://vps-3696213-x.dattaweb.com/"); // Recarga la página antes de cada test
    cy.get('img[alt="Cargando..."]', { timeout: 30000 }).should('not.exist'); // Se asegura de que la pagina cargó
  });

  describe("Botones del header", () => {
    it.skip("Existe botón de login", () => {
      cy.get("button").contains("Login");
    });

    it.skip("Navega a página de login", () => {
      cy.contains('button', 'Login', { timeout: 10000 }).should('be.visible').click();
      cy.url().should("include", "/auth/login");
    });

    it.skip("Alterna entre modo oscuro y claro", () => {
      cy.get('label[aria-label="Switch to light mode"]').first().click();
      cy.get('html').should('have.attr', 'style').and('contain', 'color-scheme: light');
      cy.get('label[aria-label="Switch to dark mode"]').first().click();
      cy.get('html').should('have.attr', 'style').and('contain', 'color-scheme: dark');
    });
  });

  describe("Filtros", () => {
    it.skip("Búsqueda de eventos", () => {
      cy.get('input[placeholder="Busca tu próxima función!"]').type("Test"); // Buscar evnetos que contengan "Test"

      // Comprobar que todos los eventos tengan "Test" en el título
      cy.get('[data-cy^="evento-card-"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-cy="evento-titulo"]').should("be.visible").and("not.be.empty")
            .invoke('text')
            .then((text) => {
              expect(text.toLowerCase()).to.include('test');
            });
        });
      });
    });

    // Posiblemente no sea posible hacer esto porque todos los eventos ya ocurrieron y no se pueden seleccionar fechas anteriores
    it.skip("Búsqueda de calendario", () => {
      // TODO
    });

    it.skip("Comprobar categorías", () => {
      cy.get('button[aria-label="Categoría"]').click();

      const expectedCategories = [
        "Recital",
        "Teatro",
        "StandUp",
        "Fiesta",
        "Conferencia",
        "Deportes",
        "Feria",
        "Festival",
        "Exposición",
        "Otro",
      ]

      expectedCategories.forEach((category) => {
        cy.get("span").contains(`${category}`).scrollIntoView().should("be.visible");
      });
    });

    it.skip("Búsqueda por categoría", () => {
      // TODO Arreglar, esto no funciona
      cy.intercept("GET", "/api/events*category=Recital*", {
        fixture: "recital-events.json",
      }).as("recitalEvents");

      cy.selectCategory("Recital");
      cy.wait("@recitalEvents");

      cy.get('[data-cy="evento-card"]').each(($card) => {
        cy.wrap($card).should("contain", "Recital");
      });
    });

    it.skip("Eventos cercanos", () => {
      // Setear una geolocalización falsa correspondiente a Córdoba
      cy.visit('https://vps-3696213-x.dattaweb.com/', {
        onBeforeLoad(win) {
          cy.stub(win.navigator.geolocation, 'getCurrentPosition')
            .callsFake((cb) => {
              cb({
                coords: {
                  latitude: -31.4167,
                  longitude: -64.1833,
                  accuracy: 100
                }
              });
            });
        }
      });

      cy.contains('label', 'Eventos cercanos').click(); // Clickear el checkbox de eventos cercanos

      // Revisar que ningún evento sea en The Roxy Live (en Buenos Aires)
      cy.get('[data-cy^="evento-lugar"]').each(($el) => {
        expect($el.text().trim()).not.to.eq("The Roxy Live");
      });
    });

    it.skip("Búsqueda por provincia y localidad", () => {
      // TODO
    });

    it.skip("Limpiar filtros", () => {
      cy.get('input[placeholder="Busca tu próxima función!"]').type("Test"); // Buscar todos los eventos que tengan "Test"

      // Revisa que ningún evento tenga el título "Tesis Cervantes" para comprobar que se aplicaron los filtros
      cy.get('[data-cy^="evento-titulo"]').each(($el) => {
        expect($el.text().trim()).not.to.eq("Tesis Cervantes");
      });

      cy.get('button').contains("Limpiar filtros").click(); // Clickea el botón de limpiar filtros

      cy.get('[data-cy^="evento-titulo"]').first().contains("Tesis Cervantes"); // Revisa que el primer evento contenga "Tesis Cervantes" para comprobar que se borraron los filtros
    });

    it("Búsqueda combinada", () => {
      // TODO
    });
  });

  describe("Eventos", () => {
    it.skip("Muestra tarjetas de evento", () => {
      cy.get('[data-cy^="evento-card-"]').each(($card) => {
        cy.wrap($card).within(() => {
          cy.get('[data-cy^="evento-img-"]').each(($img) => {
            cy.wrap($img).should("be.visible");
          });
          cy.get('[data-cy="evento-titulo"]').should("be.visible").and("not.be.empty");
          cy.get('[data-cy="evento-fecha"]').should("be.visible").and("not.be.empty");
          cy.get('[data-cy="evento-horario"]').should("be.visible").and("not.be.empty");
          cy.get('[data-cy="evento-lugar"]').should("be.visible").and("not.be.empty");
          cy.get('[data-cy^="btn-ver-evento"]').should("be.visible").and("contain", "Ver evento");
        });
      });
    });

    it.skip("Muestra eventos en un grind responsive", () => {
      cy.get('[data-cy="eventos-grid"]')
        .should("have.class", "grid")
        .and("have.class", "grid-cols-1")
        .and("have.class", "sm:grid-cols-2")
        .and("have.class", "md:grid-cols-3")
        .and("have.class", "lg:grid-cols-4");
    });

    it.skip("Carga las imagenes de eventos", () => {
      cy.get('[data-cy^="evento-img-"]').each(($img) => {
        cy.wrap($img).should("have.attr", "src").and("not.be.empty").and("not.contain", "undefined");
      });
    });
  });

  describe("Navegación de eventos", () => {
    it.skip('Abre panel de eventos al clickear "Ver evento"', () => {
      // Clickeae el primer botón de ver evento
      cy.get('[data-cy^="btn-ver-evento"]').first().click();

      // Comprobar que se abre el panel
      cy.get('.container.mx-auto.pt-0.pl-2.pr-2'); // Panel
      cy.get('.container.mx-auto img').first().should('be.visible'); // Imagen del evento
      cy.get('.container.mx-auto h1').should('be.visible').and('not.be.empty'); // Título del evento
      cy.get('.container.mx-auto').within(() => {
        cy.contains(/de \w+ de \d{4}/); // Fecha
        cy.contains(/\d{1,2}:\d{2} (AM|PM)/); // Formato horario
        cy.contains(/Cervantes|Tesis/); // Ejemplo del evento
      });
    });

    it.skip('Cerrar panel', () => {
      // Abrir el panel
      cy.get('[data-cy^="btn-ver-evento"]').first().click();

      // Apretar botón de cerrar
      cy.get('.sticky.top-5.left-3').should('be.visible').click();

      // Comprobar que desapareció el panel
      cy.get('.container.mx-auto').should('not.exist');
    });

    it.skip('URL no cambia', () => {
      // Comprobar que el botón de evento no redireccione a otra página
      cy.url().then((initialUrl) => {
        cy.get('[data-cy^="btn-ver-evento"]').first().click();
        cy.url().should('eq', initialUrl);
      });
    });

    it.skip('should display similar events in the side panel', () => {
      cy.get('[data-cy^="btn-ver-evento"]').first().click();

      // Comprobar que existe un evento similar
      cy.get('.container.mx-auto').within(() => {
        cy.contains('Eventos similares');
        cy.get('.grid.grid-cols-1.gap-4 > div').should('have.length.at.least', 1);
      });
    });
  });

  describe("Paginación", () => {
    it.skip("Se muestran controles de paginación", () => {
      cy.get('[data-cy="eventos-pagination"]').should("be.visible");
      cy.get('[aria-label*="pagination item"]').should("have.length.at.least", 1);
    });

    it.skip("Navega entre páginas", () => {
      let firstCardTitlePage1; // Variable para almacenar el primer evento de la primera página

      cy.get('[data-cy^="evento-card-"]').first().find('[data-cy^="evento-titulo"]').invoke('text').then((text) => {
        firstCardTitlePage1 = text; // Guarda el texto del primer evento
      });

      cy.get('[aria-label="pagination item 2"]').click(); // Navega a la siguiente página

      cy.get('[data-cy^="evento-card-"]').first().find('[data-cy^="evento-titulo"]').should(($el) => {
        expect($el.text()).not.to.eq(firstCardTitlePage1); // Revisa que el primer evento de la segunda página sea distinto al de la primera
      });
    });
  });
});
