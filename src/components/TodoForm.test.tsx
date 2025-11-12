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
});
