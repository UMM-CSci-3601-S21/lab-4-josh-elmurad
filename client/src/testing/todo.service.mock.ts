import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TodoService } from '../app/todos/todo.service';
import { Todo } from '../app/todos/todo';

/**
 * A "mock" version of the `Todoservice` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockTodoService extends TodoService {
  public static testTodos: Todo[] = [
    {
      _id: '123',
      owner: 'Jon',
      status: 'false',
      body: 'Test body',
      category: 'software design'
    },
    {
      _id: '1234',
      owner: 'Cena',
      status: 'false',
      body: 'Test body',
      category: 'video games'
    },
    {
      _id: '12345',
      owner: 'Bob',
      status: 'true',
      body: 'Test body',
      category: 'homework'
    },
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: { body?: string; owner?: string; order?: string }): Observable<Todo[]> {
    return of(MockTodoService.testTodos);
  }
}
