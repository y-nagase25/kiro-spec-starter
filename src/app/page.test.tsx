import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';
import { vi, beforeEach, afterEach } from 'vitest';

describe('TODO App - End-to-End Test', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle complete user flow: create, toggle, edit, delete tasks', async () => {
    // Render the app
    render(<Home />);

    // Verify empty state
    expect(screen.getByText('タスクがありません。新しいタスクを追加してください。')).toBeInTheDocument();

    // Create first task
    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByText('追加');

    fireEvent.change(input, { target: { value: '買い物に行く' } });
    fireEvent.click(addButton);

    // Verify task was created
    await waitFor(() => {
      expect(screen.getByText('買い物に行く')).toBeInTheDocument();
    });

    // Create second task
    fireEvent.change(input, { target: { value: '宿題をする' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('宿題をする')).toBeInTheDocument();
    });

    // Create third task
    fireEvent.change(input, { target: { value: 'メールを送る' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('メールを送る')).toBeInTheDocument();
    });

    // Toggle first task to completed
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    // Verify task is marked as completed (has line-through style)
    await waitFor(() => {
      const completedTask = screen.getByText('買い物に行く');
      expect(completedTask).toHaveClass('line-through');
    });

    // Edit second task
    const secondTask = screen.getByText('宿題をする');
    fireEvent.doubleClick(secondTask);

    const editInput = screen.getByDisplayValue('宿題をする');
    fireEvent.change(editInput, { target: { value: '数学の宿題をする' } });
    fireEvent.keyDown(editInput, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('数学の宿題をする')).toBeInTheDocument();
      expect(screen.queryByText('宿題をする')).not.toBeInTheDocument();
    });

    // Delete third task
    const deleteButtons = screen.getAllByRole('button', { name: /削除/i });
    fireEvent.click(deleteButtons[2]); // Delete the third task

    await waitFor(() => {
      expect(screen.queryByText('メールを送る')).not.toBeInTheDocument();
    });

    // Verify only 2 tasks remain
    expect(screen.getByText('買い物に行く')).toBeInTheDocument();
    expect(screen.getByText('数学の宿題をする')).toBeInTheDocument();
  });

  it('should persist data after page reload', async () => {
    // First render - create tasks
    const { unmount } = render(<Home />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByText('追加');

    // Create tasks
    fireEvent.change(input, { target: { value: 'タスク1' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('タスク1')).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'タスク2' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('タスク2')).toBeInTheDocument();
    });

    // Toggle first task
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    await waitFor(() => {
      const completedTask = screen.getByText('タスク1');
      expect(completedTask).toHaveClass('line-through');
    });

    // Verify data is in localStorage
    const storedData = localStorage.getItem('todos');
    expect(storedData).toBeTruthy();
    const todos = JSON.parse(storedData!);
    expect(todos).toHaveLength(2);
    expect(todos[0].title).toBe('タスク1');
    expect(todos[0].completed).toBe(true);
    expect(todos[1].title).toBe('タスク2');
    expect(todos[1].completed).toBe(false);

    // Unmount component (simulate page close)
    unmount();

    // Second render - simulate page reload
    render(<Home />);

    // Verify tasks are restored from localStorage
    await waitFor(() => {
      expect(screen.getByText('タスク1')).toBeInTheDocument();
      expect(screen.getByText('タスク2')).toBeInTheDocument();
    });

    // Verify completed state is preserved
    const restoredTask = screen.getByText('タスク1');
    expect(restoredTask).toHaveClass('line-through');

    // Verify uncompleted task doesn't have line-through
    const uncompletedTask = screen.getByText('タスク2');
    expect(uncompletedTask).not.toHaveClass('line-through');
  });
});
