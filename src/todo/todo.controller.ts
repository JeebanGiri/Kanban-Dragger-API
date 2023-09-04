import {
  Controller,
  NotImplementedException,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { createTodoSchema } from './dto/create-todo.dto';
import { TodoService } from './todo.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';
import { createUserSchema } from 'src/users/dto/create-user.dto';
import { updateTodoSchema } from './dto/update-todo.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Todo } from './entities/todo.entity';

@ApiTags('Todos list')
@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  @ApiBody({ type: Todo })
  @ApiOperation({ summary: 'get all todo items..' })
  @ApiOkResponse({ type: Todo, isArray: true })
  @ApiBadRequestResponse({ description: 'Failed to resolve the data..' })
  getTasks() {
    throw new NotImplementedException();
  }

  // find all todos item
  @Get('/find')
  @ApiBody({ type: Todo })
  @ApiOperation({ summary: 'find item from database' })
  @ApiOkResponse({ description: 'sucessfully get.' })
  @ApiBadRequestResponse({ description: 'failed to get the data.' })
  findAll() {
    return this.todoService.getAll();
  }

  // create todo
  @Post('/createtodo/:id')
  @ApiOperation({summary: 'created a todo items.'})
  @ApiOkResponse({ description: 'User created sucessfully' })
  @ApiBadRequestResponse({ description: 'User not created.' })
  @UsePipes(new JoiValidationPipe(createTodoSchema))
  @ApiBody({ type: CreateTodoDto })
  addTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() createtodoDto: CreateTodoDto,
  ) {
    return this.todoService.createTodo(id, createtodoDto);
  }

  // update todos 
  @Patch('/updatetodo/:userId/:source_Id/:target_Id')
  @UsePipes(new JoiValidationPipe(updateTodoSchema))
  @ApiBody({ type: UpdateTodoDto })
  @ApiOperation({ summary: 'Updated a todos list by dragging' })
  @ApiOkResponse({ description: 'Updated Sucessfully' })
  @ApiBadRequestResponse({ description: 'Updated Failed' })
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
