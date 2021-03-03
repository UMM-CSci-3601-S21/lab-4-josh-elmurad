import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Todo } from './todo';



@Injectable({
  providedIn: 'root',
})
export class TodoService {
  readonly todoUrl: string = environment.apiUrl + 'todos';

  constructor(private httpClient: HttpClient) {

  }

  getTodos(filters?: { body?: string; category?: string; order?: string }): Observable<Todo[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.body) {
        httpParams = httpParams.set('body', filters.body);
      }
      if (filters.category) {
        httpParams = httpParams.set('category', filters.category);

      }

    }
    return this.httpClient.get<Todo[]>(this.todoUrl, {
      params: httpParams,
    });
  }

  filterTodos(todos: Todo[], filters: { category?: string; status?: string; owner?: string; body?: string; limit?: number}): Todo[] {

    let filteredTodos = todos;

    //filter by category
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();

      filteredTodos = filteredTodos.filter(todo => todo.owner.toLowerCase().indexOf(filters.owner) !== -1);
    }
    if (filters.status){
      filters.status = filters.status.toLowerCase();
      filteredTodos = filteredTodos.filter(todo => todo.status.toString().toLowerCase().indexOf(filters.status) !== -1);
    }
    if(filters.body){
      filteredTodos = filteredTodos.filter(todo => todo.body.toLowerCase().indexOf(filters.body) !==-1);
    }
    if(filters.category){
      filteredTodos = filteredTodos.filter(todo=> todo.category.toLowerCase().indexOf(filters.category) !==-1);
    }
    if(filters.limit){
      filteredTodos = filteredTodos.slice(0, filters.limit);
    }
    return filteredTodos;
  }

  sortTodos(todos: Todo[], sortField: string){
    let filteredTodos = todos;

    filteredTodos = filteredTodos.sort((a, b) => {
      const A = a[sortField].toString().toLowerCase();
      const B = b[sortField].toString().toLowerCase();
      return(A.localeCompare(B));
    });
    return filteredTodos;
  }

  getTodoById(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(this.todoUrl + '/' + id);
  }

  addTodo(newTodo: Todo): Observable<string> {
    return this.httpClient.post<{id: string}>(this.todoUrl, newTodo).pipe(map(res => res.id));
  }

}
