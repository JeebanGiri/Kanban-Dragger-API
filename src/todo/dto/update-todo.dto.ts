import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from './task-status.enum';

export class UpdateTodoDto {
  // @IsNotEmpty()
  // @IsString()
  // id: number;

  // @IsNotEmpty()
  // @IsString()
  // order: number;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  //   status: 'Todo' | 'Doing' | 'Done';
}
