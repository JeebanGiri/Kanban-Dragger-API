import { Injectable, BadRequestException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Any, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TaskStatus } from './dto/task-status.enum';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
    private userService: UsersService,
  ) {}

  async createTodo(
    id: number,
    createTodoDto: CreateTodoDto,
  ): Promise<CreateTodoDto> {
    const user = await this.userService.getUserById(id);

    console.log(user, 'Users');
    console.log(createTodoDto, 'createTodoDto');

    if (!user) {
      throw new BadRequestException('User not Found');
    }
    const data = {
      ...createTodoDto,
      users: id,
    };

    console.log(data);
    return await this.todoRepository.save(data);
  }
  async getAll() {
    return this.todoRepository.find({
      select: ['id', 'todo', 'status', 'order'],
      order: { order: 'ASC' },
    });
  }

  findOne(datas: any) {
    return this.todoRepository.findOne({ where: { ...datas } });
  }

  getTodosByIdStatus(id: number, status: TaskStatus) {
    return this.todoRepository.find({
      where: { users: id, status: status },
      select: ['id', 'todo', 'order'],
      order: { order: 'ASC' },
    });
  }

  arrangeOrderById(id: number) {
    return this.todoRepository.find({
      where: { id: id },
      select: ['id', 'status', 'order', 'todo'],
      order: { order: 'ASC' },
    });
  }

  arrangeOrderByStatus(status: TaskStatus) {
    if (status == 'Todo' || 'Doing' || 'Done') {
      return this.todoRepository.find({
        where: { status: status },
        select: ['id', 'status'],
        order: { order: 'ASC' },
      });
    }
  }

  async updateTodos(
    userId: number,
    source_Id: number,
    target_Id: number,
    updateToDo: UpdateTodoDto,
  ) {
    try {
      const { status } = updateToDo;
      const allTodos = await this.todoRepository.find({
        where: { users: userId },
        order: { order: 'ASC' },
      });
      console.log('alltodos', allTodos);

      const sourceIndex: any = allTodos.find((todo) => todo.id === source_Id);
      const targetIndex: any = allTodos.find((todo) => todo.id === target_Id);
      console.log('source index', sourceIndex);
      console.log('target index', targetIndex);

      if (source_Id > sourceIndex.id && target_Id > targetIndex.id) {
        throw new BadRequestException('Source and target Id are not Found....');
      } else if (source_Id < sourceIndex.id && target_Id < targetIndex.id) {
        throw new BadRequestException('Source and target Id are not Found....');
      }
      const ids = { sourceIndex, targetIndex };
      if (!ids) {
        throw new BadRequestException('The Id is invalid or not found.');
      }

      if (sourceIndex.status !== status) {
        sourceIndex.status = status;
      }
      const filterItem = allTodos.filter(
        (todo) => todo.id !== source_Id && todo.status === status,
      );
      console.log('filterItem', filterItem);

      const remainingFilterItem = allTodos.filter(
        (todo) => todo.id !== source_Id && todo.status !== status,
      );
      console.log('remaining', remainingFilterItem);

      if (targetIndex) {
        const foundIndex =  filterItem.indexOf(targetIndex);

        filterItem.splice(
          foundIndex + (sourceIndex.order < targetIndex.order ? 1 : 0),
          0,
          sourceIndex,
        );

        console.log('filterItem',  filterItem);

        filterItem.forEach((todo, index) => {
          todo.order = index + 1;
        });   
        console.log("loop", filterItem)
        remainingFilterItem.forEach((todo, index) => {
          todo.order = index + 1;
        });
        console.log("loopfor remaingng", filterItem);


        await this.todoRepository.save(filterItem);
      } else {
        throw new BadRequestException(
          'You cannot drag the task in here to there.',
        );
      }
      return this.getTodosByIdStatus(userId, status);
    } catch (e) {
      throw new BadRequestException('Invalid Source and Target Id are enter.');
    }
  }
}