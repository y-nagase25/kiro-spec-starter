import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/types/todo';
import { vi } from 'vitest';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    createdAt: Date.now(),
  };

  const mockHandlers = {
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should enter edit mode when double-clicked', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);

    const todoText = screen.getByText('Test Todo');
    fireEvent.doubleClick(todoText);

    const input = screen.getByDisplayValue('Test Todo');
    expect(input).toBeInTheDocument();
  });

  it('should save changes when Enter key is pressed', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);

    const todoText = screen.getByText('Test Todo');
    fireEvent.doubleClick(todoText);

    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Updated Todo' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockHandlers.onUpdate).toHaveBeenCalledWith('1', 'Updated Todo');
  });

  it('should cancel edit when Escape key is pressed', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);

    const todoText = screen.getByText('Test Todo');
    fireEvent.doubleClick(todoText);

    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Changed Text' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(mockHandlers.onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('should not save empty title when Enter is pressed', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);

    const todoText = screen.getByText('Test Todo');
    fireEvent.doubleClick(todoText);

    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockHandlers.onUpdate).not.toHaveBeenCalled();
  });

  it('should cancel edit when input loses focus', () => {
    render(<TodoItem todo={mockTodo} {...mockHandlers} />);

    const todoText = screen.getByText('Test Todo');
    fireEvent.doubleClick(todoText);

    const input = screen.getByDisplayValue('Test Todo');
    fireEvent.change(input, { target: { value: 'Changed Text' } });
    fireEvent.blur(input);

    expect(mockHandlers.onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });
});
