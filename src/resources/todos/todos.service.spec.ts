import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Todo } from './entities/todo.entity';
import { MOCK_TODOS, MOCK_TODOS_DTO, MOCK_TODOS_LIST_RESPONSE, TODO_UPDATE_STATUS_DTO } from './mocks/todo.mock';
import { TodosService } from './todos.service';
import { TodoStatusEnum } from './constants/todo.constants';
import { CommonQueryParams, PageParams, SortParams } from '../../shared/models';
import { SortOrderEnum } from '../../shared/constants';

describe('TodoService', () => {
  let service: TodosService;
  let mockRepository;
  let mockQueryBuilder;

  const mockCountBy = jest.fn();

  beforeEach(async () => {
    mockQueryBuilder = {
      setFindOptions: jest.fn().mockImplementation(() => {
        return mockQueryBuilder;
      }),
      where: jest.fn().mockImplementation(() => {
        return mockQueryBuilder;
      }),
      andWhere: jest.fn().mockImplementation(() => {
        return mockQueryBuilder;
      }),
      orderBy: jest.fn().mockImplementation(() => {
        return mockQueryBuilder;
      }),
      getManyAndCount: jest.fn().mockResolvedValue([MOCK_TODOS, MOCK_TODOS.length]),
    };

    mockRepository = {
      create: jest.fn().mockResolvedValue(MOCK_TODOS_DTO),
      save: jest.fn().mockResolvedValue(MOCK_TODOS[0]),
      findOneBy: jest.fn().mockResolvedValue(MOCK_TODOS[0]),
      update: jest.fn().mockResolvedValue(Promise.resolve()),
      countBy: mockCountBy,
      createQueryBuilder: () => mockQueryBuilder,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create', async () => {
    await service.create(MOCK_TODOS_DTO);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(MOCK_TODOS_DTO);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('should find one', async () => {
    const id = 1;
    const result = await service.findOne(id);
    expect(result).toEqual(MOCK_TODOS[0]);
    expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('should throw error when not found one', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);
    const id = 1;
    await expect(service.findOne(id)).rejects.toThrow(Error);
    expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
  });

  it('should find all and count', async () => {
    const result = await service.findAll();
    expect(result).toEqual(MOCK_TODOS_LIST_RESPONSE);
    expect(mockQueryBuilder.setFindOptions().where().getManyAndCount).toHaveBeenCalledTimes(1);
  });

  it('should update', async () => {
    const id = 1;
    mockRepository.findOneBy.mockResolvedValue({ id, ...MOCK_TODOS_DTO });
    const result = await service.update(id, MOCK_TODOS_DTO);
    expect(result).resolves.toBeUndefined;
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith({ id, ...MOCK_TODOS_DTO });
  });

  it('should update status', async () => {
    const id = 1;
    mockRepository.findOneBy.mockResolvedValue({ ...MOCK_TODOS[0] });
    await service.updateStatus(id, TODO_UPDATE_STATUS_DTO);

    expect(mockRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith({ ...MOCK_TODOS[0], ...TODO_UPDATE_STATUS_DTO });
  });

  it('should soft delete', async () => {
    const id = 1;
    mockRepository.findOneBy.mockResolvedValue({ ...MOCK_TODOS[0] });

    const result = await service.remove(id);
    expect(result).resolves.toBeUndefined;
    expect(mockRepository.save).toHaveBeenCalledWith({ ...MOCK_TODOS[0], softDelete: true });
  });

  it('should apply filter', async () => {
    mockQueryBuilder.getManyAndCount.mockResolvedValue([[MOCK_TODOS[0]], 1]);
    const filter: CommonQueryParams = { status: TodoStatusEnum.TEST };
    const result = await service.findAll(filter);
    expect(mockQueryBuilder.setFindOptions().where).toHaveBeenCalledWith({ softDelete: false, ...filter });
    expect(result.items.length).toBe(1);
  });

  it('should apply sorting', async () => {
    const sorting: SortParams = { sort: 'title', order: SortOrderEnum.ASC };
    await service.findAll(null, null, sorting);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('title', 'ASC');
  });

  it('should apply pagination', async () => {
    const pagination: PageParams = { limit: 45, offset: 123 };
    await service.findAll(null, pagination, null);
    expect(mockQueryBuilder.setFindOptions).toHaveBeenCalledWith({
      skip: pagination.offset,
      take: pagination.limit,
    });
  });
});
