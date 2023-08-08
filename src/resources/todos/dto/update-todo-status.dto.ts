import { TodoStatusEnum } from '../constants/todo.constants';
import { IsEnum, IsDefined, IsString } from 'class-validator';

export class UpdateTodoStatusDto {
  @IsEnum(TodoStatusEnum)
  @IsString()
  @IsDefined()
  status: TodoStatusEnum;
}
