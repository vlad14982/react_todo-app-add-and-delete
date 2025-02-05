import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../enums/TodoFilter';

interface TodoFooterProps {
  todos: Todo[];
  todosLeft: number;
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  loading: boolean;
  clearCompletedTodos: () => void;
}

const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  todosLeft,
  filter,
  onFilterChange,
  loading,
  clearCompletedTodos,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todosLeft} item{todosLeft !== 1 ? 's' : ''} left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filter === TodoFilter.ALL,
              })}
              data-cy="FilterLinkAll"
              onClick={() => onFilterChange(TodoFilter.ALL)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filter === TodoFilter.ACTIVE,
              })}
              data-cy="FilterLinkActive"
              onClick={() => onFilterChange(TodoFilter.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filter === TodoFilter.COMPLETED,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => onFilterChange(TodoFilter.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={loading || !todos.some(todo => todo.completed)}
            onClick={clearCompletedTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};

export default TodoFooter;
