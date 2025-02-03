import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  filteredTodos: Todo[];
  loading: boolean;
  isActive: number | undefined;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
}

export const TodoList: React.FC<TodoListProps> = ({
  filteredTodos,
  loading,
  isActive,
  onDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loading={loading}
          isActive={isActive}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          loading={true}
          isActive={isActive}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
