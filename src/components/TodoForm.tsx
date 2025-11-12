'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TodoFormProps {
  onAddTodo: (title: string) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 入力バリデーション（空文字チェック）
    const trimmedTitle = title.trim();
    if (trimmedTitle === '') {
      return;
    }

    // タスクを作成
    onAddTodo(trimmedTitle);
    
    // 入力フィールドをクリア
    setTitle('');
  };

  return (
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
  );
}
