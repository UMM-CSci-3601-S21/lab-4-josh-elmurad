import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockUserService } from 'src/testing/user.service.mock';
import { AddTodoComponent } from './add-todo.component';
import { TodoService } from './todo.service';
import { MockTodoService } from 'src/testing/todo.service.mock';

describe('AddTodoComponent', () => {
  let addTodoComponent: AddTodoComponent;
  let addTodoForm: FormGroup;
  let fixture: ComponentFixture<AddTodoComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [AddTodoComponent],
      providers: [{ provide: TodoService,  useValue: new MockTodoService() }],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    addTodoComponent = fixture.componentInstance;
    addTodoComponent.ngOnInit();
    fixture.detectChanges();
    addTodoForm = addTodoComponent.addTodoForm;
    expect(addTodoForm).toBeDefined();
    expect(addTodoForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(addTodoComponent).toBeTruthy();
    expect(addTodoForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addTodoForm.valid).toBeFalsy();
  });

  describe('The owner field', () => {
    let ownerControl: AbstractControl;

    beforeEach(() => {
      ownerControl = addTodoComponent.addTodoForm.controls.owner;
    });

    it('should not allow empty owners', () => {
      ownerControl.setValue('');
      expect(ownerControl.valid).toBeFalsy();
    });

    it('should be fine with "Josh Quist"', () => {
      ownerControl.setValue('Josh Quist');
      expect(ownerControl.valid).toBeTruthy();
    });

    it('should fail on really long owners', () => {
      ownerControl.setValue('x'.repeat(100));
      expect(ownerControl.valid).toBeFalsy();
    });
  });

  describe('The status field', () => {
    let statusControl: AbstractControl;

    beforeEach(() => {
      statusControl = addTodoComponent.addTodoForm.controls.status;
    });

    it('should not allow empty status fields', () => {
      statusControl.setValue('');
      expect(statusControl.valid).toBeFalsy();
    });

    it('should allow allow \'false\'', () => {
      statusControl.setValue('false');
      expect(statusControl.valid).toBeTruthy();
    });

    it('should allow allow \'True\'', () => {
      statusControl.setValue('True');
      expect(statusControl.valid).toBeTruthy();
    });
  });

  describe('The category field', () => {
    let catControl: AbstractControl;

    beforeEach(() => {
      catControl = addTodoComponent.addTodoForm.controls.category;
    });

    it('should not allow empty categories', () => {
      catControl.setValue('');
      expect(catControl.valid).toBeFalsy();
    });

    it('should be fine with "Cooking"', () => {
      catControl.setValue('Cooking');
      expect(catControl.valid).toBeTruthy();
    });

    it('should fail on really long categories', () => {
      catControl.setValue('y'.repeat(100));
      expect(catControl.valid).toBeFalsy();
    });
  });

  describe('The body field', () => {
    let bodyControl: AbstractControl;

    beforeEach(() => {
      bodyControl = addTodoComponent.addTodoForm.controls.body;
    });

    it('should not allow an empty body', () => {
      bodyControl.setValue('');
      expect(bodyControl.valid).toBeFalsy();
    });

    it('should allow the body "Baking an apple pie with mom"', () => {
      bodyControl.setValue('Baking an apple pie with mom');
      expect(bodyControl.valid).toBeTruthy();
    });
  });
});
