import { Body, Controller, Delete, Get, HttpException, HttpStatus, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { Express } from "express";

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { FileUploadService } from '@/files/files.service';
import { ParseFilePipeDocument } from '@/files/files.validator';
import { TranslationService } from '@/translation/translation.service';
import { CurrentUser } from '@/user/decorators/currentUser.decorator';
import { UserRequest } from '@/user/decorators/user.decorator';
import { UserUpdatedDto } from '@/user/dto/userUpdated';
import { UserGuard } from '@/user/guards/user.guard';
import { Role } from '@/user/role.enum';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';
import hashPassword from '@/utils/auth.variable';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@ApiUnauthorizedResponse({ description: "User not connected" })
@Controller('users')
export class UserController {

  constructor(private userService: UserService, private readonly translationService: TranslationService, private readonly fileUploadService: FileUploadService) { }

  @Get("")
  @ApiOperation({ summary: 'Returns all users' })
  @ApiOkResponse({ description: "Users found successfully", type: User, isArray: true })
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/me')
  @ApiOperation({ summary: 'Return my user informations' })
  @ApiOkResponse({ description: "User found successfully", type: User })
  @ApiNotFoundResponse({ description: "User not found" })
  getMe(@CurrentUser() user: User): User {
    console.log(user);
    return user;
  }

  @Get("/:userId")
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Return a user' })
  @ApiParam({ name: 'userId', description: 'ID of user', required: true })
  @ApiOkResponse({ description: "User found successfully", type: User })
  @ApiNotFoundResponse({ description: "User not found" })
  getOneUser(@UserRequest() user: User): User {
    return user;
  }

  @Put('/:userId')
  @UseGuards(UserGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'userId', description: 'ID of user', required: true })
  @ApiOkResponse({ description: "User updated successfully", type: User })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiUnauthorizedResponse({ description: "User not connected or user not admin" })
  @ApiConflictResponse({ description: "User already exists" })
  async update(@CurrentUser() me: User, @UserRequest() user: User, @Body() body: UserUpdatedDto, @UploadedFile(ParseFilePipeDocument) file?: Express.Multer.File): Promise<User> {
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
    if (file) {
      const fileName = await this.fileUploadService.uploadFile(file);
      body = { ...body, image: fileName };
    }
    await this.userService.update(user.id, body);
    const userUpdated = await this.userService.findOneUser(user.id);
    if (!userUpdated) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return userUpdated;
  }

  @Delete('/:userId')
  @UseGuards(UserGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'userId', description: 'ID of user', required: true })
  @ApiOkResponse({ description: "User deleted succesfully" })
  @ApiUnauthorizedResponse({ description: "User not connected or user not admin" })
  @ApiNotFoundResponse({ description: "User not found" })
  async delete(@CurrentUser() me: User, @UserRequest() user: User): Promise<void> {
    if (me.role !== Role.Admin && me.id !== user.id) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_ADMIN'), HttpStatus.UNAUTHORIZED);
    }
    await this.userService.delete(user.id);
  }
}