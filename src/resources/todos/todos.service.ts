import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { CommonQueryParams, PageParams, SortParams } from '../../shared/models';
import { SortOrderEnum } from '../../shared/constants';

@Injectable()
export class TodosService {
  logger = new Logger(TodosService.name);

  constructor(@InjectRepository(Todo) private todoRepository: Repository<Todo>) {}

  async findAll(commonFindParams?: CommonQueryParams, pageParams?: PageParams, sortParams?: SortParams) {
    const findOptions = {
      ...(pageParams && {
        skip: pageParams.offset,
        take: pageParams.limit,
      }),
    };
    const filter: FindOptionsWhere<Todo> = {
      softDelete: false,
      ...(commonFindParams?.status && { status: commonFindParams.status }),
    };

    const sort = sortParams?.sort ?? 'id';
    const order = sortParams?.order ?? SortOrderEnum.DESC;

    const query = this.todoRepository
      .createQueryBuilder()
      .setFindOptions(findOptions)
      .where(filter)
      .orderBy(sort, order as SortOrderEnum);

    if (commonFindParams?.search) {
      query.andWhere({ title: Like(`%${commonFindParams.search}%`) });
    }

    const [items, count] = await query.getManyAndCount();
    this.logger.log(`Items count ${count}`);

    return {
      pageInfo: {
        limit: pageParams?.limit || count,
        offset: pageParams?.offset || 0,
        count,
      },
      items,
    };
  }

  async findOne(id: number) {
    const item = await this.todoRepository.findOneBy({ id, softDelete: false });
    this.logger.log(`Item: ${item}`);
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async create(createTodoDto: CreateTodoDto) {
    const newTodo = this.todoRepository.create(createTodoDto);
    await this.checkTitleUniqueness(newTodo.title);
    const result = await this.todoRepository.save(newTodo);
    this.logger.log(`Item created`);

    return result;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const entity = await this.findOne(id);
    await this.checkTitleUniqueness(updateTodoDto.title);
    await this.todoRepository.save(Object.assign(entity, updateTodoDto));
    this.logger.log(`Item updated`);
  }

  async remove(id: number) {
    const todo = await this.findOne(id);
    await this.todoRepository.save(Object.assign(todo, { softDelete: true }));
    this.logger.log(`Item deleted`);
  }

  async updateStatus(id: number, updateTodoStatusDto: UpdateTodoStatusDto) {
    const todo = await this.findOne(id);
    await this.todoRepository.save(Object.assign(todo, updateTodoStatusDto));
    this.logger.log(`Item status updated to ${updateTodoStatusDto.status}`);
  }

  private async checkTitleUniqueness(title: string) {
    const count = await this.todoRepository.countBy({ title });
    if (count > 0) {
      throw new ConflictException('Todo with the title already exists');
    }
  }
}
