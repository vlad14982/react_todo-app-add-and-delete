/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import * as postService from './api/todos';
import { Todo } from './types/Todo';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isActive] = useState<number>();
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  // #region inputFocus
  const inputRef = useRef<HTMLInputElement>(null);

  const inputfocus = () => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    inputfocus();
  }, []);
  //#endregion

  // #region loadTodos
  const loadTodos = async () => {
    setErrorMessage('');

    postService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  };

  useEffect(() => {
    loadTodos();
  }, []);
  //#endregion

  // #region filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };
  //#endregion

  // #region add, delete
  function addPost(title: string) {
    setIsInputDisabled(true);
    setErrorMessage('');
    setTempTodo({
      id: 0,
      userId: postService.USER_ID,
      title: title.trim(),
      completed: false,
    });

    return postService
      .createTodos(title.trim())
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setIsInputDisabled(false);
        inputfocus();
      });
  }

  function deleteTodo(id: number) {
    setLoading(true);

    return postService
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        setErrorMessage(`Unable to delete a todo`);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        inputfocus();
      });
  }

  const clearCompletedTodos = () => {
    setLoading(true);
    const completedTodos = todos.filter(todo => todo.completed);
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //#endregion

  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  // #region errorMessage
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleCloseError = () => {
    setErrorMessage('');
  };
  //#endregion

  const todosLeft = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          loading={loading}
          isInputDisabled={isInputDisabled}
          todosLeft={todosLeft}
          onSubmit={addPost}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
        />

        <TodoList
          filteredTodos={filteredTodos}
          loading={loading}
          isActive={isActive}
          onDelete={deleteTodo}
          tempTodo={tempTodo}
        />

        <TodoFooter
          todos={todos}
          todosLeft={todosLeft}
          filter={filter}
          onFilterChange={handleFilterChange}
          loading={loading}
          clearCompletedTodos={clearCompletedTodos}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={handleCloseError}
      />
    </div>
  );
};
