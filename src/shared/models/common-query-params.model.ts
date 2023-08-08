import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, Min, IsInt } from 'class-validator';
import { TodoStatusEnum } from '../../resources/todos/constants/todo.constants';
import { SortOrderEnum } from '../constants';

export class CommonQueryParams {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(TodoStatusEnum)
  status?: TodoStatusEnum;

  @Type(() => Number)
  @Min(0)
  @IsInt()
  @IsOptional()
  limit?: number;

  @Type(() => Number)
  @Min(0)
  @IsInt()
  @IsOptional()
  offset?: number;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsEnum(SortOrderEnum)
  @IsOptional()
  order?: string;
}
