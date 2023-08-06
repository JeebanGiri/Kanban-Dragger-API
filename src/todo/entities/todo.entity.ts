import { User } from 'src/users/entities/user.entity';
import { TaskStatus } from '../dto/task-status.enum';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';


@Entity({ name: 'todos_list' })
export class Todo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.Todo,
  })
  status: TaskStatus;

   @Column()
  todo: string;


  @Column()
  order: number;


  @Column()
  users: number;
  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'users' })
  user: User;
}



 
  // @Column()
  // status: 'Todo' | 'Doing' | 'Done'