import { Body, Controller, HttpException, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Express, Response } from "express";

import { LoginDto } from '@/auth/dto/login.dto';
import { LoginResponse } from '@/auth/dto/loginResponse';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from '@/auth/service/auth.service';
import { FileUploadService } from '@/files/files.service';
import { ParseFilePipeDocument } from '@/files/files.validator';
import { TranslationService } from '@/translation/translation.service';
import { UserService } from '@/user/service/user.service';

const expirationTime = new Date(Date.now() + 7 * 24 * 60 * 60); // 7 days
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly translationService: TranslationService, private readonly fileUploadService: FileUploadService) {}
    
  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiOkResponse({ type: LoginResponse })
  async login(@Body() body: LoginDto, @Res() response: Response): Promise<{}> {
    const user = await this.userService.findOneEmail(body.email);
    if (!user) {
      throw new HttpException(await this.translationService.translate('error.INVALID_CREDENTIALS'), HttpStatus.BAD_REQUEST);
    }
    if (!await comparePassword(body.password, user.password)) {
      throw new HttpException(await this.translationService.translate('error.INVALID_CREDENTIALS'), HttpStatus.BAD_REQUEST); // user does not know if email or password is not valid
    }
    const { accessToken } = this.authService.login(user);
    response.cookie('access_token', accessToken, {
      expires: expirationTime,
      httpOnly: true
    });
    return response.send({ accessToken });
  }

  @Post('/register')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while creating the user" })
  @ApiConflictResponse({ description: "A user with the given email or username already exists" })
  @ApiCreatedResponse({ 
    description: "The user was successfully registered and an access token has been returned", 
    type: LoginResponse 
  })
  async register(@Body() body: RegisterDto, @UploadedFile(ParseFilePipeDocument) file?: Express.Multer.File): Promise<{ accessToken: string }> {
    if (await this.userService.checkUnknownUser(body)) {
      throw new HttpException(await this.translationService.translate('error.USER_EXIST'), HttpStatus.CONFLICT);
    }
    if (file) {
      const fileName = await this.fileUploadService.uploadFile(file);
      body = { ...body, image: fileName };
    }
    body.password = await hashPassword(body.password);
    const user = await this.userService.create(body);
    if (!user) {
      throw new HttpException(await this.translationService.translate('error.USER_CANT_CREATE'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.authService.login(user);
  }
}

async function hashPassword(plaintextPassword: string) {
  return bcrypt.hash(plaintextPassword, 10);
}

async function comparePassword(plaintextPassword: string, hash: string) {
  return bcrypt.compare(plaintextPassword, hash);
}
