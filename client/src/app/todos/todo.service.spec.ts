import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { ActivatedRoute, provideRoutes } from '@angular/router';

describe('TodoService', () => {
  const testTodos: Todo[] = [
    {
      _id:'12345',
      owner: 'John',
      status: 'false',
      body: 'test body',
      category: 'software design'
    },
    {
      _id: '123456',
      owner: 'Cena',
      status: 'false',
      body: 'test body',
      category: 'video games'
    },
    {
      _id: '1234567',
      owner: 'Jeff',
      status: 'true',
      body: 'test body',
      category: 'homework'
    },
    {
      _id: '1234',
      owner: 'John',
      status: 'true',
      body: 'test body',
      category: 'software design'
    }
  ];
  let todoService: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;


  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getTodos()', () =>{
    it( 'calls api/todos when getTodos() is called with no parameters', () =>{
      todoService.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(todoService.todoUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testTodos);
    });
  });

  describe('Calling getTodos() with parameters correct forms the HTTP request', () => {

      it('correctly calls api/todos with multiple filter parameters', () => {

      todoService.getTodos({ body: 'tempor', category: 'groceries' }).subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL with the role parameter.
      const req = httpTestingController.expectOne(
        (request) => request.url.startsWith(todoService.todoUrl)
          && request.params.has('body') && request.params.has('category')
      );

      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');

      // Check that the parameters are correct
      expect(req.request.params.get('category')).toEqual('groceries');
      expect(req.request.params.get('body')).toEqual('tempor');


      req.flush(testTodos);
    });

  });

  describe('filterTodos()', () => {


    it('filters by owner', () => {
      const todoOwner = 'Cena';
      const filteredTodos = todoService.filterTodos(testTodos, { owner: todoOwner });
      // There should be 1 todo with an Cena as the owner
      expect(filteredTodos.length).toBe(1);
      // Every returned Todo's owner should be Cena.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by status', () => {
      const todoStatus = 'false';
      const filteredTodos = todoService.filterTodos(testTodos, { status: todoStatus });
      //There should be two todos with a false status
      expect(filteredTodos.length).toBe(2);
      // Every returned Todo's status should contain false.
      filteredTodos.forEach(todo => {
        expect(todo.status.indexOf(todoStatus)).toBeGreaterThanOrEqual(0);
      });
    });
    it('filters by body', () => {
      const todoBody = 'test';
      const filteredTodos = todoService.filterTodos(testTodos, { body: todoBody });
      //There should be two todos with a false status
      expect(filteredTodos.length).toBe(4);
      // Every returned Todo's body should contain 'tempor'
      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoBody)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by category', () => {
      const todoCategory = 'video games';
      const filteredTodos = todoService.filterTodos(testTodos, { category: todoCategory });
      //There should be one todo with category 'video games'
      expect(filteredTodos.length).toBe(1);
      // Every returned Todo's category should be "video"
      filteredTodos.forEach(todo => {
        expect(todo.body.indexOf(todoCategory)).toBeGreaterThanOrEqual(-1);
      });
    });
  });



  describe('sortTodos() ', () => {

    it('sorts todos by body', () => {
      const sortField = 'body';
      const filteredTodos = todoService.sortTodos(testTodos, sortField);

      for(let i=0; i<filteredTodos.length-1; i++){
        expect((filteredTodos[i][sortField]).localeCompare(filteredTodos[i+1][sortField])).toBeLessThanOrEqual(0);

      }
    });

    it('sorts todos by category', () => {
      const sortField = 'category';
      const filteredTodos = todoService.sortTodos(testTodos, sortField);

      for(let i=0; i<filteredTodos.length-1; i++){
        expect((filteredTodos[i][sortField]).localeCompare(filteredTodos[i+1][sortField])).toBeLessThanOrEqual(0);

      }
    });

    it('sorts todos by status', () => {
      const sortField = 'status';
      const filteredTodos = todoService.sortTodos(testTodos, sortField);

      for(let i=0; i<filteredTodos.length-1; i++){
        expect((filteredTodos[i][sortField]).localeCompare(filteredTodos[i+1][sortField])).toBeLessThanOrEqual(0);

      }
    });

    it('sorts todos by owner', () => {
      const sortField = 'owner';
      const filteredTodos = todoService.sortTodos(testTodos, sortField);

      for(let i=0; i<filteredTodos.length-1; i++){
        expect((filteredTodos[i][sortField]).localeCompare(filteredTodos[i+1][sortField])).toBeLessThanOrEqual(0);

      }
    });
  });

  describe('get todos by id', () =>{
    it('gets a todo given its id', () => {
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      todoService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = todoService.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });
});
