import { Store, select } from '@ngrx/store';
import { OnInit, Component, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TodoListModule } from './store/actions/todo-list.action';
import { AppState } from './store';
import { Todo } from './models/todo';
import { selectTodos$ } from  './store/selectors/todo-list.selector';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  OnInit {
  todos$: Observable<Todo[]>;
  public  todoForm: FormGroup;
  private todoslength : number;

  constructor(
    private store: Store<AppState>,
    @Inject(FormBuilder) fb: FormBuilder
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

  deleteTodo(id: number) {
    this.store.dispatch(new TodoListModule.DeleteTodo(id));
  }
}
