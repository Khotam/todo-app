import * as request from 'supertest';

import { TodoStatusEnum } from '../../src/resources/todos/constants/todo.constants';
import { CreateTodoDto } from '../../src/resources/todos/dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../../src/resources/todos/dto/update-todo-status.dto';
import { UpdateTodoDto } from '../../src/resources/todos/dto/update-todo.dto';

const baseURL = 'http://localhost:3000/v1/';

describe('Todos', () => {
  let id;
  const random = Math.random();
  const apiRequest = request(baseURL);

  describe('GET: /todos', () => {
    it('should have the response', async () => {
      const response = await apiRequest.get('todos');

      expect(response.status).toBe(200);
    });
  });

  describe('POST: /todos', () => {
    it('should have the response', async () => {
      const response = await apiRequest
        .post('todos')
        .send({ title: `test ${random}`, description: 'test', estimate: 1, order_id: 1 } as CreateTodoDto);

      id = response.body.id;

      expect(response.status).toBe(201);
    });
  });

  describe('GET: /todos/:id', () => {
    it('should have the response', async () => {
      const response = await apiRequest.get(`todos/${id}`);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should have the response', async () => {
      const response = await apiRequest.put(`todos/${id}`).send({ title: `updated ${random}` } as UpdateTodoDto);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT: todos/:id/status', () => {
    it('should have the response', async () => {
      const response = await apiRequest
        .put(`todos/${id}/status`)
        .send({ status: TodoStatusEnum.DONE } as UpdateTodoStatusDto);

      expect(response.status).toBe(200);
    });
  });

  describe('DELETE: todo/:id', () => {
    it('should have the response', async () => {
      const response = await apiRequest.delete(`todos/${id}`);

      expect(response.status).toBe(200);
    });
  });
});
