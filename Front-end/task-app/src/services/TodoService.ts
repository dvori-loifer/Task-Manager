import { Todo } from '../models/Todo';

const API_URL = '/api/todos'; // שנה לכתובת ה-API שלך במידת הצורך

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
};

export const addTodo = async (text: string): Promise<Todo> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to add todo');
  return res.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete todo');
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const res = await fetch(`${API_URL}/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
};
