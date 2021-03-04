import { Todo } from 'src/app/todos/todo';
import { AddTodoPage } from '../support/add-todo.po';

describe('Add todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add user button', () => {
    // ADD TODO button should be disabled until all the necessary fields
    // are filled. Once the last (`#emailField`) is filled, then the button should
    // become enabled.
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('test');
    page.addTodoButton().should('be.disabled');
    page.getFormField('category').type('20');
    page.addTodoButton().should('be.disabled');
    page.getFormField('body').type('body');
    // all the required fields have valid input, then it should be enabled
    page.addTodoButton().should('be.enabled');
  });

  it('should display an error for invalid inputs', () => {
    cy.get('[data-test=ownerError]').should('not.exist');
    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');

    page.getFormField('owner').type('John');
    cy.get('[data-test=ownerError]').should('not.exist');

    cy.get('[data-test=categoryError]').should('not.exist');
    page.getFormField('category').type('this is longer than the allowed 50 characters for category').blur();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').clear();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');
    page.getFormField('category').type('reasonable category length');
    cy.get('[data-test=categoryError]').should('not.exist');

  });


  describe('Adding a new todo', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('should go to the right page and have correct information', () => {
      const todo: Todo = {
        _id: null,
        owner: 'Josh',
        category: 'video',
        body: 'video games',
        status: 'true'
      };

      page.addTodo(todo);

      cy.url()
      .should('match', /\/todos\/[0-9a-fA-F]{24}$/)
      .should('not.match', /\/todos\/new$/);

      cy.get('.todo-card-owner').should('contain.text', todo.owner);
      cy.get('.user-card-category').should('contain.text', todo.category);
      cy.get('.todo-card-body').should('contain.text', todo.body);
      cy.get('.todo-card-status').should('contain.text', todo.status);

      cy.get('.mat-simple-snackbar').should('contain', 'Added Todo Successfully');
    });

  });
});
