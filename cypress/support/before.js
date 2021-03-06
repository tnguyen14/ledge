import { loginButton } from '../selectors';

before(() => {
  cy.visit('/');
  cy.get('body').then(($body) => {
    if ($body.find(loginButton).length) {
      cy.log('Login required - performing login');
      cy.login();
      cy.saveLocalStorage();
    }
  });
});
