import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppState } from '@StoreConfig';
import { selectTodoSelected$ } from '@Selectors/todo-list.selector';
import { TodoListModule } from '@Actions/todo-list.action';
import { TodoListState, Todo } from '@Models/todo';

@Component({
  selector: 'app-select-todo',
  templateUrl: './select-todo.component.html',
  styleUrls: ['./select-todo.component.scss']
})
export class SelectTodoComponent implements OnInit {

  public updateTodoForm: FormGroup;
  public selectTodo$: Observable<Todo>;
  public selectTodo: Todo;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    @Inject(FormBuilder) fb: FormBuilder
  ) {
  this.selectTodo$ = store
  .pipe(
    select(selectTodoSelected$),
    tap(selectTodo => {
      this.selectTodo = selectTodo;
    })
  );

  this.selectTodo$.subscribe();

    this.updateTodoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });
  }
  ngOnInit() {
    if (this.selectTodo) {
      this.updateTodoForm.patchValue({
        title: this.selectTodo.title,
        completed: this.selectTodo.completed
      });
    }
  }

  updateTodo(formValue) {
    const payload = Object.assign(this.selectTodo, formValue);
    this.store.dispatch(new TodoListModule.UpdateTodo(payload));
    return this.router.navigate(['/todo-list/all-todos']);
  }

}
