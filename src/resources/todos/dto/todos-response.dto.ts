import { ApiProperty } from '@nestjs/swagger';

import { TodoStatusEnum } from '../constants/todo.constants';

class PageInfo {
  @ApiProperty()
  count: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

class TodoModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  estimate: number;

  @ApiProperty()
  order_id: number;

  @ApiProperty({ example: '2023-08-08T01:52:53.892Z' })
  createdAt: string;

  @ApiProperty({ example: TodoStatusEnum.DONE })
  status: TodoStatusEnum;
}

export class TodosResponse {
  pageInfo: PageInfo;
  items: TodoModel[];
}
