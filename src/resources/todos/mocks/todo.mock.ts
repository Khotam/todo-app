import { TodoStatusEnum } from '../constants/todo.constants';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoStatusDto } from '../dto/update-todo-status.dto';
import { Todo } from '../entities/todo.entity';

export const MOCK_TODOS_DTO: CreateTodoDto = {
  title: 'test',
  description: 'description',
  estimate: 5,
  order_id: 2,
};

export const TODO_UPDATE_STATUS_DTO: UpdateTodoStatusDto = {
  status: TodoStatusEnum.DONE,
};

export const MOCK_TODOS: Todo[] = [
  {
    id: 1,
    title: 'test 1',
    description: 'description 1',
    estimate: 1,
    status: TodoStatusEnum.TEST,
    order_id: 1,
    createdAt: new Date(2023, 1, 1).toISOString(),
    softDelete: false,
  },
  {
    id: 2,
    title: 'test 2',
    description: 'description 2',
    estimate: 2,
    status: TodoStatusEnum.DONE,
    order_id: 1,
    createdAt: new Date(2023, 1, 2).toISOString(),
    softDelete: false,
  },
];

export const MOCK_TODOS_LIST_RESPONSE = {
  items: MOCK_TODOS,
  pageInfo: {
    limit: 2,
    count: 2,
    offset: 0,
  },
};
