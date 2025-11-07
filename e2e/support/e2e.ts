// Cucumber preprocessor step definitions are loaded per-file; this just sets up global support
import '@cypress/code-coverage/support';

// Handy command to get menu cards
Cypress.Commands.add('getMenuCards', () => cy.get('.menu-grid .card'));

declare global {
  namespace Cypress {
    interface Chainable {
      getMenuCards(): Chainable<JQuery<HTMLElement>>;
    }
  }
}
