import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1894;

export function getTodos() {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
}

export function createTodos(title: string) {
  return client.post<Todo>(`/todos`, {
    title,
    userId: USER_ID,
    completed: false,
  });
}

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}
