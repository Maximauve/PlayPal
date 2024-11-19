import { Body, Controller, Delete, Get, HttpException, HttpStatus, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RedisService } from "@/redis/service/redis.service";
import { TranslationService } from '@/translation/translation.service';
import { CurrentUser } from '@/user/decorators/currentUser.decorator';
import { UserRequest } from '@/user/decorators/user.decorator';
import { UserUpdatedDto } from '@/user/dto/userUpdated';
import { Role } from '@/user/role.enum';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';
import hashPassword from '@/utils/auth.variable';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@ApiUnauthorizedResponse()
@Controller('users')
export class UserController {

  constructor(private userService: UserService, private readonly redisService: RedisService, private readonly translationService: TranslationService) { }

  @Get("/")
  @ApiOperation({ summary: 'Returns all users' })
  @ApiOkResponse({ type: User, isArray: true })
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/me')
  @ApiOperation({ summary: 'Return my user informations' })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  getMe(@CurrentUser() user: User): User {
    return user;
  }

  @Get("/:id")
  @ApiOperation({ summary: 'Return a user' })
  @ApiParam({ name: 'id', description: 'ID of user', required: true })
  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse()
  getOneUser(@UserRequest() user: User): User {
    return user;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'ID of user', required: true })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async update(@CurrentUser() me: User, @UserRequest() user: User, @Body() body: UserUpdatedDto): Promise<User> {
    if (me.role !== Role.Admin && me.id !== user.id) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_ADMIN'), HttpStatus.UNAUTHORIZED);
    }
    if (me.role !== Role.Admin) {
      delete body.role;
    }
    if (await this.userService.checkUnknownUser(body, user.id)) {
      throw new HttpException(await this.translationService.translate('error.USER_EXIST'), HttpStatus.CONFLICT);
    }
    if (body.password) {
      body.password = await hashPassword(body.password);
    }
    await this.userService.update(user.id, body);
    const userUpdated = await this.userService.findOneUser(user.id);
    if (!userUpdated) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return userUpdated;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'ID of user', required: true })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async delete(@CurrentUser() me: User, @UserRequest() user: User): Promise<void> {
    if (me.role !== Role.Admin && me.id !== user.id) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_ADMIN'), HttpStatus.UNAUTHORIZED);
    }
    return this.userService.delete(user.id);
  }
}