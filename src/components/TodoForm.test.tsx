import { render, screen, fireEvent } from '@testing-library/react';
import { TodoForm } from './TodoForm';
import { vi } from 'vitest';

describe('TodoForm', () => {
  it('should call onAddTodo with trimmed title when form is submitted', () => {
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByText('追加');

    fireEvent.change(input, { target: { value: '  Test Todo  ' } });
    fireEvent.click(button);

    expect(mockOnAddTodo).toHaveBeenCalledWith('Test Todo');
  });

  it('should not call onAddTodo when title is empty', () => {
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const button = screen.getByText('追加');
    fireEvent.click(button);

    expect(mockOnAddTodo).not.toHaveBeenCalled();
  });

  it('should not call onAddTodo when title contains only whitespace', () => {
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByText('追加');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(mockOnAddTodo).not.toHaveBeenCalled();
  });

  it('should clear input field after successful submission', () => {
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...') as HTMLInputElement;
    const button = screen.getByText('追加');

    fireEvent.change(input, { target: { value: 'Test Todo' } });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });

  it('should not clear input field when submission is prevented due to empty title', () => {
    const mockOnAddTodo = vi.fn();
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...') as HTMLInputElement;
    const button = screen.getByText('追加');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(input.value).toBe('   ');
  });

  it('should display error message when maximum limit is exceeded', () => {
    const mockOnAddTodo = vi.fn().mockReturnValue('タスクの最大数（10件）を超過しています');
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByText('追加');

    fireEvent.change(input, { target: { value: 'Test Todo' } });
    fireEvent.click(button);

    expect(mockOnAddTodo).toHaveBeenCalledWith('Test Todo');
    expect(screen.getByText('タスクの最大数（10件）を超過しています')).toBeInTheDocument();
  });

  it('should not clear input field when maximum limit is exceeded', () => {
    const mockOnAddTodo = vi.fn().mockReturnValue('タスクの最大数（10件）を超過しています');
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...') as HTMLInputElement;
    const button = screen.getByText('追加');

    fireEvent.change(input, { target: { value: 'Test Todo' } });
    fireEvent.click(button);

    expect(input.value).toBe('Test Todo');
  });

  it('should clear error message on next submission attempt', () => {
    const mockOnAddTodo = vi.fn()
      .mockReturnValueOnce('タスクの最大数（10件）を超過しています')
      .mockReturnValueOnce(null);
    
    render(<TodoForm onAddTodo={mockOnAddTodo} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByText('追加');

    // First submission - error
    fireEvent.change(input, { target: { value: 'Test Todo 1' } });
    fireEvent.click(button);
    expect(screen.getByText('タスクの最大数（10件）を超過しています')).toBeInTheDocument();

    // Second submission - success
    fireEvent.change(input, { target: { value: 'Test Todo 2' } });
    fireEvent.click(button);
    expect(screen.queryByText('タスクの最大数（10件）を超過しています')).not.toBeInTheDocument();
  });
});
