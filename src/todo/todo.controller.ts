import {
  Controller,
  NotImplementedException,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  getTasks() {
    throw new NotImplementedException();
  }

  // find all todos item
  @Get('/find')
  findAll() {
    return this.todoService.getAll();
  }

  // create todo
  @Post('/createtodo/:id')
  addTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() createtodoDto: CreateTodoDto,
  ) {
    return this.todoService.createTodo(id, createtodoDto);
  }

  // update todos
  @Patch('/updatetodo/:userId/:source_Id/:target_Id')
  updateToDo(
    @Param('userId', new ParseIntPipe()) userId: number,
    @Param('source_Id', new ParseIntPipe()) source_Id: number,
    @Param('target_Id', new ParseIntPipe()) target_Id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todoService.updateTodos(
      userId,
      source_Id,
      target_Id,
      updateTodoDto,
    );
  }
}
