import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
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
import { type JwtPayload } from '@playpal/schemas/jwt.interface';
import { Request } from 'express';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RedisService } from "@/redis/service/redis.service";
import { TranslationService } from '@/translation/translation.service';
import { UserUpdatedDto } from '@/user/dto/userUpdated';
import { Role } from '@/user/role.enum';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';
import hashPassword from '@/utils/auth.variable';
import { uuidRegex } from '@/utils/regex.variable';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('users')
export class UserController {

  constructor(private userService: UserService, private readonly redisService: RedisService, private readonly translationService: TranslationService) { }

  @Get("/")
  @ApiOperation({ summary: 'Returns all users' })
  @ApiOkResponse({ type: User, isArray: true })
  @ApiUnauthorizedResponse()
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/me')
  @ApiOperation({ summary: 'Return my user informations' })
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getMe(@Req() request: Request): Promise<User> {
    const requestUser: JwtPayload = request?.user as JwtPayload;
    if (!requestUser) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    const user: User | null = await this.userService.findOneUser(requestUser?.id);
    if (!user) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get("/:id")
  @ApiOperation({ summary: 'Return a user' })
  @ApiParam({ name: 'id', description: 'ID of user', required: true })
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getOneUser(@Param('id') id: string): Promise<User> {
    const user: User | null = await this.userService.findOneUser(id);
    if (!user) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'ID of user', required: true })
  @ApiOkResponse({ type: User })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiConflictResponse()
  async update(@Req() request: Request, @Param('id') id: string, @Body() body: UserUpdatedDto): Promise<User> {
    const me = await this.userService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(id)) {
      throw new HttpException(await this.translationService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    if (me.role !== Role.Admin && me.id !== id) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_ADMIN'), HttpStatus.UNAUTHORIZED);
    }
    if (me.role !== Role.Admin) {
      delete body.role;
    }
    if (await this.userService.checkUnknownUser(body, id)) {
      throw new HttpException(await this.translationService.translate('error.USER_EXIST'), HttpStatus.CONFLICT);
    }
    if (body.password) {
      body.password = await hashPassword(body.password);
    }
    await this.userService.update(id, body);
    const user = await this.userService.findOneUser(id);
    if (!user) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'ID of user', required: true })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async delete(@Req() request: Request, @Param('id') id: string): Promise<void> {
    const me = await this.userService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (me.role !== Role.Admin && me.id !== id) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_ADMIN'), HttpStatus.UNAUTHORIZED);
    }
    if (!uuidRegex.test(id)) {
      throw new HttpException(await this.translationService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    return this.userService.delete(id);
  }
}