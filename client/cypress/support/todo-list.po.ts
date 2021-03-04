export class TodoListPage {
  navigateTo() {
    return cy.visit('/todos');
  }

  getTodoListItems() {
    return cy.get('.todo-nav-list .todo-list-item');
  }

  /**
   * Clicks the "view profile" button for the given user card.
   * Requires being in the "card" view.
   *
   * @param card The user card
   */
  clickViewProfile(list: Cypress.Chainable<JQuery<HTMLElement>>) {
    return list.find<HTMLButtonElement>('[data-test=viewDetailButton]').click();
  }

  /**
   * Selects a role to filter in the "Role" selector.
   *
   * @param value The role *value* to select, this is what's found in the mat-option "value" attribute.
   */

  addTodoButton() {
    return cy.get('[data-test=addTodoButton]');
  }
}
