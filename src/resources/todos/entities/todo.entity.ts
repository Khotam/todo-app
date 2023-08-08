import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TodoStatusEnum } from '../constants/todo.constants';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'int', nullable: true })
  order_id?: number;

  @Column({ enum: TodoStatusEnum, default: TodoStatusEnum.TEST })
  status: string;

  @Column({ type: 'int', nullable: true })
  estimate?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: string;

  @Column({ type: 'bool', default: false, select: false })
  softDelete: boolean;
}
