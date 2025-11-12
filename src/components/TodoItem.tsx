'use client';

import { useState, KeyboardEvent } from 'react';
import { Todo } from '@/types/todo';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Enterキーで編集を確定
      const trimmedTitle = editTitle.trim();
      if (trimmedTitle.length > 0) {
        onUpdate(todo.id, trimmedTitle);
        setIsEditing(false);
      }
    } else if (e.key === 'Escape') {
      // Escキーで編集をキャンセル
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    // フォーカスが外れたら編集をキャンセル
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={`${todo.title}を完了としてマーク`}
      />
      
      {isEditing ? (
        <Input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="flex-1"
          autoFocus
        />
      ) : (
        <span
          onDoubleClick={handleDoubleClick}
          className={`flex-1 cursor-pointer ${
            todo.completed
              ? 'line-through text-muted-foreground'
              : ''
          }`}
        >
          {todo.title}
        </span>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        aria-label={`${todo.title}を削除`}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
