import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UsersModule],
  controllers: [TodoController],
  providers: [TodoService]
})
export class TodoModule {}
