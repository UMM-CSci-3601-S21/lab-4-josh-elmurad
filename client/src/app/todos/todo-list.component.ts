import { Component, OnDestroy, OnInit } from '@angular/core';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-todo-list',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: []

})
export class TodoListComponent implements OnInit, OnDestroy {

  public serverFilteredTodos: Todo[] = [];
  public filteredTodos: Todo[];

  // Made public so that tests can reference them
  public todoBody: string;
  public todoCategory: string;
  public todoStatus: string;
  public todoOwner: string;
  public todoLimit: number;
  public sortBy: 'body' | 'status' | 'owner' | 'category' = 'owner';
  public viewType: 'list';
  getTodosSub: Subscription;


  constructor(private todoService: TodoService) {

  }

  getTodosFromServer() {
    this.unsub();
    this.getTodosSub = this.todoService.getTodos({
      body: this.todoBody,
      category: this.todoCategory
    }).subscribe(returnedTodos => {
      this.serverFilteredTodos = returnedTodos;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredTodos = this.todoService.filterTodos(
      this.serverFilteredTodos, { status: this.todoStatus, owner: this.todoOwner, body: this.todoBody, limit: this.todoLimit });
  }

  public updateSort(sortField: string) {
    this.filteredTodos = this.todoService.sortTodos(
      this.serverFilteredTodos, sortField);
      this.updateFilter();

  }

  ngOnInit(): void {
    this.getTodosFromServer();
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.unsub();
  }
  unsub(): void {
    if (this.getTodosSub) {
      this.getTodosSub.unsubscribe();
    }
  }


}
