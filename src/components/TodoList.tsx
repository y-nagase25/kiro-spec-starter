'use client';

import { useTodos } from '@/hooks/useTodos';
import { TodoForm } from '@/components/TodoForm';
import { TodoItem } from '@/components/TodoItem';

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos();

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">TODOアプリ</h1>
      
      <TodoForm onAddTodo={addTodo} />

      {todos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          タスクがありません。新しいタスクを追加してください。
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
}
