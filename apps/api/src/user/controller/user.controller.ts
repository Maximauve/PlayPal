import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RedisService } from "@/redis/service/redis.service";
import { TranslationService } from '@/translation/translation.service';
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
}