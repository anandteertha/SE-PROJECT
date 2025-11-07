// e2e/steps/authentication_steps.ts

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// --- Reusable Login Step ---
Given('I am logged in', () => {
  cy.visit('http://localhost:4200/login');
  // NOTE: Use a real user that you have registered in your database
  cy.get('input[formControlName="loginId"]').type('george@gmail.com');
  cy.get('input[formControlName="password"]').type('Password123!');
  cy.get('button').contains('Sign in').click();
  cy.url().should('include', '/home');
});

// --- Generic Steps ---

Given('I am on the {string} page', (path: string) => {
  cy.visit(`http://localhost:4200${path}`);
});

//
// THIS IS THE CORRECTED FUNCTION
//
When('I fill in {string} with {string}', (label: string, text: string) => {
  // This new version maps the Gherkin step to the correct formControlName
  
  let controlName = '';
  if (label === 'Name') {
    controlName = 'name';
  } else if (label === 'Username') {
    controlName = 'username'; // This is from your register form
  } else if (label === 'E-mail') {
    controlName = 'email';
  } else if (label === 'Password') {
    controlName = 'password';
  } else if (label === 'Confirm password') {
    controlName = 'confirmPassword';
  } else if (label === 'Username or E-mail') {
    controlName = 'loginId'; // This is from your login form
  }

  // This finds the input by its formControlName, which is very reliable
  cy.get(`input[formControlName="${controlName}"]`).type(text);
});
//
// END OF CORRECTED FUNCTION
//

When('I check {string}', (label: string) => {
  // Finds the checkbox by its label text and checks it
  cy.contains('mat-checkbox', label).click();
});

When('I click the {string} button', (buttonText: string) => {
  cy.get('button').contains(buttonText).click();
});

Then('I should be redirected to the {string} page', (path: string) => {
  cy.url().should('include', path);
});

Then('I should see the {string} button', (buttonText: string) => {
  cy.get('button').contains(buttonText).should('be.visible');
});

Then('I should see {string}', (message: string) => {
  cy.contains(message).should('be.visible');
});

Then('the {string} button should be disabled', (buttonText: string) => {
  cy.get('button').contains(buttonText).should('be.disabled');
});

// --- Special Steps for This Feature ---

Given('a user with the email {string} already exists', (email: string) => {
  // This is a placeholder for now.
  cy.log(`Assuming user ${email} already exists.`);
});

Then('I should remain on the {string} page', (path: string) => {
  cy.url().should('include', path);
});