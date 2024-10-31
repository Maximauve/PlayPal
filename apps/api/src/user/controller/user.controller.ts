import { Body, Controller, Get, HttpException, Post, UseFilters } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RedisService } from "@/redis/service/redis.service";
import { TranslationService } from '@/translation/translation.service';
import { type CreatedUserDto } from '@/user/dto/user.dto';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {

  constructor(private userService: UserService, private readonly redisService: RedisService, private readonly translationService: TranslationService) { }

  @Get("/")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    type: User,
    isArray: true
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async GetAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Post('/')
  @UseFilters(new I18nValidationExceptionFilter())
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'User already exist.' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  async SignUp(@Body() body: CreatedUserDto): Promise<{}> {
    if (await this.userService.checkUnknownUser(body)) {
      throw new HttpException(await this.translationService.translate('error.USER_EXIST'), 409);
    }
    body.password = await hashPassword(body.password);
    return this.userService.create(body);
  }
}

async function hashPassword(plaintextPassword: string) {
  return bcrypt.hash(plaintextPassword, 10);
}