'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TodoFormProps {
  onAddTodo: (title: string) => string | null;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // エラーメッセージをクリア
    setError(null);
    
    // 入力バリデーション（空文字チェック）
    const trimmedTitle = title.trim();
    if (trimmedTitle === '') {
      return;
    }

    // タスクを作成
    const errorMessage = onAddTodo(trimmedTitle);
    
    if (errorMessage) {
      // エラーメッセージを表示
      setError(errorMessage);
      return;
    }
    
    // 入力フィールドをクリア
    setTitle('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          className="flex-1"
        />
        <Button type="submit">
          追加
        </Button>
      </form>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
