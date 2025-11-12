import { render, screen } from '@testing-library/react';
import { TodoList } from './TodoList';
import { vi } from 'vitest';

// Mock the useTodos hook
vi.mock('@/hooks/useTodos', () => ({
  useTodos: vi.fn(),
}));

import { useTodos } from '@/hooks/useTodos';

describe('TodoList', () => {
  it('should display empty message when there are no todos', () => {
    // Mock useTodos to return empty array
    vi.mocked(useTodos).mockReturnValue({
      todos: [],
      addTodo: vi.fn(),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      updateTodo: vi.fn(),
    });

    render(<TodoList />);

    expect(screen.getByText('タスクがありません。新しいタスクを追加してください。')).toBeInTheDocument();
  });
});
