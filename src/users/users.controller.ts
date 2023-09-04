import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,    
  ApiTags,
} from '@nestjs/swagger';
import { JoiValidationPipe } from 'src/pipes/joi-validation.pipe';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/createuser')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  @ApiBody({ type: CreateUserDto })             // Circular Dependency
  @ApiOperation({ summary: 'Create a User...' })
  @ApiOkResponse({ description: 'Create user sucessfully..' })
  @ApiBadRequestResponse({ description: 'User is not created...' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiBody({ type: User })                     // circular dependency
  @ApiOperation({ summary: 'find all the User...' })
  @ApiOkResponse({ description: 'User get sucessfully..' })
  @ApiBadRequestResponse({ description: 'User is not found...' })
  findAll() {
    return this.usersService.getAllUser();
  }

  @Get(':id')
  @ApiBody({ type: User })              // ciruclar dependency
  @ApiOperation({ summary: 'Found a User by id...' })
  @ApiOkResponse({ description: 'User found by id sucessfully..' })
  @ApiBadRequestResponse({ description: 'User is not found wiht that id...' })
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.usersService.getUserById(id);
  }
}
