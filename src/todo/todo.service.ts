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

  async getAll() {
    return this.todoRepository.find({
      select: ['id', 'todo', 'status', 'order'],
      order: { order: 'ASC' },
    });
  }

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

  findOne(datas: any) {
    return this.todoRepository.findOne({ where: { ...datas } });
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
      console.log(allTodos);

      const sourceIndex: any = allTodos.find((todo) => todo.id === source_Id);
      const targetIndex: any = allTodos.find((todo) => todo.id === target_Id);

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
        (todo) => todo.id !== sourceIndex && todo.status === status,
      );

      const remainingFilterItem = allTodos.filter(
        (todo) => todo.id !== sourceIndex && todo.status !== status,
      );

      filterItem.splice(targetIndex.order - 1, 0, sourceIndex);
      console.log('Inside Splice');
      console.log(filterItem);

      for (let i = 0; i < filterItem.length; i++) {
        if (filterItem[i].id === sourceIndex) {
          filterItem[i].order = targetIndex;
        } else if (filterItem[i].order !== i + 1) {
          filterItem[i].order = i + 1;
        }
      }

      console.log('omg');
      console.log(filterItem);
      await this.todoRepository.save(filterItem);
      return this.getTodobyUser(userId);
    } catch (e) {
      console.log(e, 'Good Bye');
    }
  }

  getTodobyUser(id: number) {
    return this.todoRepository.find({
      where: { users: id },
      select: ['id', 'status', 'order', 'todo'],
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

  //   async updateTodos(userId: number, updateToDo: UpdateTodoDto) {
  //     const { id, status } = updateToDo;

  //     const allTodos = await this.todoRepository.find({
  //       where: { users: userId },
  //       // select: ['id', 'todo'],
  //       order: { order: 'ASC' },
  //     });

  //     const source = allTodos.find((todo) => todo.id === id);
  //     console.log(source, 'source data');

  //     if(source.status !== status){
  //       source.status = status
  //     }

  //     console.log('reach');

  //     // console.log(source);
  //     console.log('source data');

  //     const to_update = allTodos.filter((todo) => todo.id !== id);
  //     // console.log(to_update, 'updat ed using filter');

  //     to_update.splice(order - 1, 0, source);
  //     // console.log(to_update, 'update after splice');

  //     for (let i = 0; i < to_update.length; i++) {
  //       if (to_update[i].id === id) {
  //         to_update[i].order = order;
  //       } else if (to_update[i].order !== i + 1) {
  //         to_update[i].order = i + 1;
  //       }
  //     }

  //     console.log(to_update, 'after al update');
  //     await this.todoRepository.save(to_update);
  //     return this.getTodobyUser(userId);
  //   }

  //   getTodobyUser(id: number) {
  //     return this.todoRepository.find({
  //       where: { users: id },
  //       select: ['id', 'status', 'order', 'todo'],
  //       order: { order: 'ASC' },
  //     });
}
