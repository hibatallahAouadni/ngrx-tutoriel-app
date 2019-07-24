import { Store, select } from '@ngrx/store';
import { OnInit, Component, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TodoListModule } from '@Actions/todo-list.action';
import { AppState } from '@StoreConfig';
import { Todo } from '@Models/todo';
import { selectTodos$ } from  '@Selectors/todo-list.selector';

@Component({
  selector: 'app-all-todos',
  templateUrl: './all-todos.component.html',
  styleUrls: ['./all-todos.component.scss']
})
export class AllTodosComponent implements OnInit {

  todos$: Observable<Todo[]>;
  public  todoForm: FormGroup;
  private todoslength : number;

  constructor(
    private store: Store<AppState>,
    @Inject(FormBuilder) fb: FormBuilder,
    private router: Router
  ) {
    this.todos$ = store
      .pipe(
        select(selectTodos$),
        //tap : invoque une action pour chaque élément de la séquence observable
        tap((todos) => {
          this.todoslength = todos.length;
        })
      );
    this.todoForm = fb.group({
      title: ['', Validators.required],
      completed: [false, Validators]
    });
  }
  
  ngOnInit() {
    this.store.dispatch(new TodoListModule.InitTodos());
  }

  createTodo(todo: Todo) {
    const  payload = {
      ...todo,
      userId: 1,
      id: this.todoslength + 1
    };
  
    this.store.dispatch(new  TodoListModule.CreateTodo(payload));
    this.todoForm.reset();
  }
  
  selectTodo(todo) {
    this.store.dispatch(new TodoListModule.SelectTodo(todo));
    this.router.navigate(['/todo-list/select-todo']);
  }

  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.DeleteTodo(id));
  }

}
