import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from './task-status.enum';
// import Joi from 'joi';
import * as Joi from 'joi';


export const updateTodoSchema = Joi.object({
  status: Joi.string().required()
})

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
