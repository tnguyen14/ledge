import {
  newTransactionForm,
  firstWeek,
  currentMonthAverageValue,
  weekStats4WeekAverageValue,
  accountStatsWeeklyAveragesSelector,
  accountStatsAverages
} from '../selectors.js';

describe('Display', () => {
  it('logged in content', () => {
    cy.get(newTransactionForm).should('be.visible');

    cy.get('select[name=category]').should('have.value', 'dineout');
    cy.get('select[name=source]').should('have.value', 'chase-sapphire');

    cy.get(accountStatsWeeklyAveragesSelector).click();
    cy.get(accountStatsAverages).should('be.visible');
    cy.get(currentMonthAverageValue).invoke('text').as('currentMonthAverage');

    cy.get(firstWeek).scrollIntoView();
    cy.get(`${firstWeek} ${weekStats4WeekAverageValue}`).should(function (
      $4weekAverage
    ) {
      expect($4weekAverage.text()).to.equal(this.currentMonthAverage);
    });
  });
});
