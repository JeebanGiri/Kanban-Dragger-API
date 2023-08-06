import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

export type  Users=any;

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>){}


  async createUser(createUserDto: CreateUserDto) {
  const  createUser = this.userRepository.create(createUserDto);
  return await this.userRepository.save(createUser);
  }

  getAllUser(){
    return this.userRepository.find()
  }

  getUserById(id: number): Promise<Users>{
    return this.userRepository.findOne({where: {id: id}})
  }
}
