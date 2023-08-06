import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo/entities/todo.entity';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TodoModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'wrl',
        password: process.env.DB_PASSWORD || 'internship',
        database: process.env.DB_DATABASE || 'todos',
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        // entities: [User,Todo],
        synchronize: true,
      }),
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
