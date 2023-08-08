import { PartialType } from '@nestjs/swagger';
import { CreateTodoDto } from './create-todo.dto';
import { ValidateIf } from 'class-validator';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ValidateIf((_, value) => value !== undefined)
  title?: string;

  @ValidateIf((_, value) => value !== undefined)
  description?: string;

  @ValidateIf((_, value) => value !== undefined)
  estimate?: number;

  @ValidateIf((_, value) => value !== undefined)
  order_id?: number;
}
