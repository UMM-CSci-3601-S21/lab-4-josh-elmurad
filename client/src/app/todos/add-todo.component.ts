import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  todo: Todo;

  addTodoValidationMessages = {
    owner: [
      {type: 'required', message: 'An owner is required'},
      {type: 'minlength', message: 'Owner must be at least 1 character long'},
      {type: 'maxlength', message: 'Owner cannot be more than 50 characters long'},
    ],

    category: [
      {type: 'required', message: 'A category is required'},
      {type: 'minlength', message: 'Category must be at least 1 character long'},
      {type: 'maxlength', message: 'Category cannot be more than 50 characters long'}
    ],

    body: [
      {type: 'required', message: 'A body is required'},
      {type: 'minlength', message: 'Body must be at least 1 character long'},
      {type: 'maxlength', message: 'Body cannot be more than 150 characters long'}
    ],

    status: [
      {type: 'required', message: 'A status is required'},
      {type: 'pattern', message: 'Status must be Complete or Incomplete'}
    ]

  };

  constructor(private fb: FormBuilder, private todoService: TodoService, private snackBar: MatSnackBar, private router: Router) { }

  createForms() {

    this.addTodoForm = this.fb.group({
      owner: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ])),

      category: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ])),

      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(150)
      ])),

      status: new FormControl(false, Validators.compose([
        Validators.minLength(1),
        Validators.maxLength(50)
      ])),
    });
  }

  ngOnInit(): void {
    this.createForms();
  }

  submitForm() {
    this.todoService.addTodo(this.addTodoForm.value).subscribe(newID => {
      this.snackBar.open('Added Todo Successfully', null, {
        duration: 2000,
      });
      this.router.navigate(['/todos/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the todo', 'OK', {
        duration: 5000,
      });
    });
  }

}
