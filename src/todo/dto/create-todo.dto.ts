import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { TaskStatus } from './task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {

  @ApiProperty({description: 'Todos means task', example: 'Todo'})
  @IsNotEmpty()
  @IsString()
  todo: string;

  @ApiProperty({description: 'Todos Status', example: 'Todo status'})
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({description: 'Todos order', example: 'Todo order'})
  @IsNotEmpty()
  @IsString()
  order: number;
}
