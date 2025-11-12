import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty todos array', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('should add a new todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test Todo');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Test Todo');
    expect(result.current.todos[0].completed).toBe(false);
  });

  it('should not add todo with empty title', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('   ');
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('should toggle todo completion status', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test Todo');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  it('should delete a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test Todo');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  it('should update todo title', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Original Title');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.updateTodo(todoId, 'Updated Title');
    });

    expect(result.current.todos[0].title).toBe('Updated Title');
  });

  it('should not update todo with empty title', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Original Title');
    });

    const todoId = result.current.todos[0].id;

    act(() => {
      result.current.updateTodo(todoId, '   ');
    });

    expect(result.current.todos[0].title).toBe('Original Title');
  });

  it('should save todos to localStorage', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Test Todo');
    });

    const stored = localStorage.getItem('todos');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('Test Todo');
  });

  it('should load todos from localStorage', () => {
    const mockTodos = [
      {
        id: '1',
        title: 'Stored Todo',
        completed: false,
        createdAt: Date.now(),
      },
    ];

    localStorage.setItem('todos', JSON.stringify(mockTodos));

    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Stored Todo');
  });
});
