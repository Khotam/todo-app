import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { MOCK_TODOS, MOCK_TODOS_DTO, MOCK_TODOS_LIST_RESPONSE, TODO_UPDATE_STATUS_DTO } from './mocks/todo.mock';
import { TodosService } from './todos.service';
import { CommonQueryParams } from '../../shared/models';

describe('TodosController', () => {
  const findParams = { search: 'test' } as CommonQueryParams;
  const id = 1;
  let controller: TodosController;
  let mockTodosService;

  beforeEach(async () => {
    mockTodosService = {
      findAll: jest.fn().mockResolvedValue(MOCK_TODOS_LIST_RESPONSE),
      findOne: jest.fn().mockResolvedValue(MOCK_TODOS[0]),
      create: jest.fn().mockResolvedValue(MOCK_TODOS[0]),
      update: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      updateStatus: jest.fn().mockResolvedValue(undefined),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        TodosService,
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all', async () => {
    expect(await controller.findAll(findParams)).toEqual(MOCK_TODOS_LIST_RESPONSE);
    expect(mockTodosService.findAll).toHaveBeenCalled();
  });

  it('should get one', async () => {
    expect(await controller.findOne(id)).toEqual(MOCK_TODOS[0]);
    expect(mockTodosService.findOne).toHaveBeenCalledWith(id);
  });

  it('should create', async () => {
    expect(await controller.create(MOCK_TODOS_DTO)).toEqual(MOCK_TODOS[0]);
    expect(mockTodosService.create).toHaveBeenCalledWith(MOCK_TODOS_DTO);
  });

  it('should update', async () => {
    await controller.update(id, MOCK_TODOS_DTO);
    expect(mockTodosService.update).toHaveBeenCalledWith(id, MOCK_TODOS_DTO);
  });

  it('should update todo status', async () => {
    await controller.updateStatus(1, TODO_UPDATE_STATUS_DTO);
    expect(mockTodosService.updateStatus).toHaveBeenCalledWith(1, TODO_UPDATE_STATUS_DTO);
  });

  it('should delete', async () => {
    expect(await controller.remove(id)).toEqual(undefined);
    expect(mockTodosService.remove).toHaveBeenCalledWith(id);
  });
});
