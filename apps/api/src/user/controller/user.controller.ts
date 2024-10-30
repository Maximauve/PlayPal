import { Body, Controller, Get, HttpException, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { RedisService } from "../../redis/service/redis.service";
import { User } from '../user.entity';
import { CreatedUserDto } from '../dto/user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@ApiTags('users')
@Controller('users')
export class UserController {

  constructor(private userService: UserService, private readonly redisService: RedisService) {}

  @Get("/")
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    type: User,
    isArray: true
  })
  async GetAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @UsePipes(ValidationPipe)
  @Post('/')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'User already exist.' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  async SignUp(@Body() body: CreatedUserDto): Promise<{}> {
    if (await this.userService.checkUnknownUser(body)) throw new HttpException('L\'utilisateur existe déjà', 409);
    body.password = await hashPassword(body.password);
    return this.userService.create(body);
  }
}

async function hashPassword(plaintextPassword: string) {
  return await bcrypt.hash(plaintextPassword, 10);
}