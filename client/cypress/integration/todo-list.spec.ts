import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should show 300 todos', () => {
    page.getTodoListItems().should('have.length', 300);
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for todos 'Fry'
    cy.get('#todo-owner-input').type('Fry');

  page.getTodoListItems().each(e => {
    cy.wrap(e).find('.todo-list-owner').should('have.text', 'Fry');
  });

  // (We check this two ways to show multiple ways to check this)
  page.getTodoListItems().find('.todo-list-owner').each($el =>
    expect($el.text()).to.equal('Fry')
  );

  });

  it('Should type something in the body filter and check that it returned correct elements', () => {
    // Filter for todos 'sunt'
    cy.get('#todo-body-input').type('sunt');

    // All of the todos cards should have the body we are filtering by
    // (We check this two ways to show multiple ways to check this)
    page.getTodoListItems().find('.todo-list-body').each($el =>
      expect($el.text()).to.contain('sunt')
    );
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    // Filter for category 'homework'
    cy.get('#todo-category-input').type('homework');

    page.getTodoListItems().should('have.lengthOf.above', 0);

    // All of the todos cards should have the category we are filtering by
    page.getTodoListItems().find('.todo-list-category').each(list => {
      cy.wrap(list).should('have.text', 'homework');
    });
  });

  it('Should click add todo and go to the right URL', () => {
    // Click on the button for adding a new user
    page.addTodoButton().click();

    // The URL should end with '/users/new'
    cy.url().should(url => expect(url.endsWith('/todos/new')).to.be.true);

    // On the page we were sent to, We should see the right title
    cy.get('.add-todo-title').should('have.text', 'New Todo');
  });

});
