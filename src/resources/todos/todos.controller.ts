import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { Page } from '../../shared/decorators/page-params.decorator';
import { Sort } from '../../shared/decorators/sort-params.decorator';
import { TodoStatusEnum } from './constants/todo.constants';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosResponse } from './dto/todos-response.dto';
import { UpdateTodoStatusDto } from './dto/update-todo-status.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';
import { SortOrderEnum } from '../../shared/constants';
import { CommonQueryParams, PageParams, SortParams } from '../../shared/models';

@Controller('todos')
@ApiTags('Todos')
export class TodosController {
  constructor(private readonly todoService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch a list of available todos' })
  @ApiResponse({ type: TodosResponse })
  @ApiQuery({ name: 'offset', type: String, description: 'number of skipped items', required: false })
  @ApiQuery({ name: 'limit', type: String, description: 'items per page', required: false })
  @ApiQuery({ name: 'search', type: String, description: 'search key', required: false })
  @ApiQuery({ name: 'status', type: String, enum: TodoStatusEnum, description: 'filter by status', required: false })
  @ApiQuery({ name: 'sort', type: String, description: 'sort key', required: false })
  @ApiQuery({ name: 'order', type: String, enum: SortOrderEnum, description: 'order by', required: false })
  findAll(
    @Query() commonFindParams?: CommonQueryParams,
    @Page() pageParams?: PageParams,
    @Sort() sortParams?: SortParams,
  ) {
    return this.todoService.findAll(commonFindParams, pageParams, sortParams);
  }

  @Get('/:id(\\d+)')
  @ApiOperation({ summary: 'Fetch a single todo by id' })
  @ApiOkResponse({
    description: 'Successful operation',
    type: Todo,
  })
  @ApiNotFoundResponse({ description: 'Todo not found' })
  findOne(@Param('id') id: number) {
    return this.todoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiCreatedResponse({
    description: 'Successful operation',
    type: Todo,
  })
  @ApiBadRequestResponse({ description: 'Validation exception.' })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Put('/:id(\\d+)')
  @ApiOperation({ summary: 'Update todo by id' })
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiNotFoundResponse({ description: 'Todo is provided but not found' })
  @ApiBadRequestResponse({ description: 'Validation exception.' })
  update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete('/:id(\\d+)')
  @ApiOperation({ summary: 'Soft delete the todo by id' })
  @ApiOkResponse({
    description: 'Successful operation',
    type: DeleteResult,
  })
  @ApiNotFoundResponse({ description: 'Todo is provided but not found' })
  remove(@Param('id') id: number) {
    return this.todoService.remove(id);
  }

  @Put('/:id(\\d+)/status')
  @ApiOperation({ summary: 'Update the status of the todo by id' })
  @ApiOkResponse({ description: 'Successful operation' })
  @ApiNotFoundResponse({ description: 'Todo is provided but not found' })
  @ApiBadRequestResponse({ description: 'Validation exception.' })
  updateStatus(@Param('id') id: number, @Body() updateTodoStatusDto: UpdateTodoStatusDto) {
    return this.todoService.updateStatus(id, updateTodoStatusDto);
  }
}
