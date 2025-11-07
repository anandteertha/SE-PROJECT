import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const api = {
  menu: /\/api\/menu-items.*/,
  user: /\/api\/user\/details.*/,
  prefs: /\/api\/user\/preferences.*/,
  cart: /\/api\/cart.*/,
};

Before(() => {
  // ensure clean local state
  localStorage.clear();
});

Given('the backend is stubbed', () => {
  cy.intercept('GET', api.menu, { fixture: 'menu-data.json' }).as('getMenu');
  cy.intercept('GET', api.user, { fixture: 'user-details.json' }).as('getUser');
  cy.intercept('PATCH', api.prefs, (req) => {
    req.reply({});
  }).as('patchPrefs');
  cy.intercept('POST', api.cart, (req) => {
    req.reply({ ...req.body });
  }).as('postCart');
});

Given('I visit the menu page', () => {
  cy.visit('/menu');
  cy.wait(['@getMenu', '@getUser']);
});

When('I type {string} in the search bar', (text: string) => {
  cy.get('app-search-bar .search-input').clear().type(text);
});

When('I clear the search bar', () => {
  cy.get('app-search-bar .clear-btn').click();
});

Then('I should see {int} menu cards', (count: number) => {
  cy.getMenuCards().should('have.length', count);
});

Then('at least {int} menu cards are visible', (min: number) => {
  cy.getMenuCards().its('length').should('be.gte', min);
});

When('I open the filters panel', () => {
  cy.contains('button.filters-btn', 'Filters').click();
  cy.get('.filters-trigger').should('have.class', 'open');
});

When('I close the filters panel', () => {
  cy.get('.filters-trigger').then(($host) => {
    if ($host.hasClass('open')) cy.contains('button.filters-btn', 'Filters').click();
  });
});

When('I select category {string}', (category: string) => {
  cy.get('.filters-panel .group').contains('Categories');
  cy.get('.filters-panel .group .btns').contains(category).click();
});

When('I select dietary preference {string}', (diet: string) => {
  cy.get('.filters-panel .group').contains('Dietary Preferences');
  cy.get('.filters-panel .group .btns').contains(diet).click();
});

When('I set spiciness to {int}', (val: number) => {
  cy.get('.filters-panel .taste-row.spicy input[type="range"]').invoke('val', val).trigger('input');
});

When('I set sweetness to {int}', (val: number) => {
  cy.get('.filters-panel .taste-row.sweet input[type="range"]').invoke('val', val).trigger('input');
});

When('I set salt level to {string}', (level: string) => {
  cy.get('.filters-panel .salt-btn').contains(new RegExp(level, 'i')).click();
});

When('I apply filters', () => {
  cy.contains('.panel-actions .btn-primary', 'Apply').click();
});

When('I reset filters', () => {
  cy.contains('.panel-actions .btn-secondary', 'Reset').click();
});

Then('a user preferences update is sent', () => {
  cy.wait('@patchPrefs');
});

When('I toggle dark mode', () => {
  cy.get('button.theme-toggle').click();
});

Then('dark mode is {string}', (state: string) => {
  const expectOn = state === 'on';
  cy.get('body').should(expectOn ? 'have.class' : 'not.have.class', 'dark-mode');
  cy.window().then((w) => {
    expect(w.localStorage.getItem('darkMode')).to.eq(expectOn ? 'yes' : 'no');
  });
});

When('I add the first item to the cart', () => {
  cy.getMenuCards().first().within(() => {
    cy.get('.revolving-button-container').last().click({ force: true });
  });
});

When('I remove the first item from the cart', () => {
  cy.getMenuCards().first().within(() => {
    cy.get('.revolving-button-container').first().click({ force: true });
  });
});

Then('the cart badge shows {int}', (count: number) => {
  cy.get('.cart-badge').should('contain.text', String(count));
});

Then('the cart badge bounces briefly', () => {
  cy.get('.cart-badge').should('have.class', 'bounce');
});

Then('a cart update is sent with quantity {int} for item id {int}', (qty: number, id: number) => {
  cy.wait('@postCart').its('request.body').should((body: any) => {
    expect(body.Quantity).to.eq(qty);
    expect(body.MenuItemId).to.eq(id);
  });
});

Then('the profile shows {string}', (name: string) => {
  cy.get('.user-profile .username').should('contain.text', name);
});

Given('a logged in user {string}', (email: string) => {
  cy.window().then((w) => {
    w.localStorage.setItem('user', JSON.stringify({ email }));
  });
});

Then('I see at least one {string} filter option', (label: string) => {
  cy.contains('.filters-panel .group h4', label).parent().find('button').its('length').should('be.gte', 1);
});

Then('the spiciness bubble reflects {int}', (val: number) => {
  cy.get('.taste-row.spicy .bubble').should('contain.text', String(val));
});

Then('the sweetness bubble reflects {int}', (val: number) => {
  cy.get('.taste-row.sweet .bubble').should('contain.text', String(val));
});

Then('the filters trigger aria-expanded is {string}', (state: string) => {
  const expected = state === 'true' ? 'true' : 'false';
  cy.get('button.filters-btn').should('have.attr', 'aria-expanded', expected);
});
