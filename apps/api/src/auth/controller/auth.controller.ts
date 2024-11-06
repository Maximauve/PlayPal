import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '@/auth/dto/login.dto';
import { LoginResponse } from '@/auth/dto/loginResponse';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from '@/auth/service/auth.service';
import { TranslationService } from '@/translation/translation.service';
import { UserService } from '@/user/service/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly translationService: TranslationService) {}
    
  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: LoginResponse })
  async login(@Body() body: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findOneEmail(body.email);
    if (!user) {
      throw new HttpException(await this.translationService.translate('error.USER_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    if (!await comparePassword(body.password, user.password)) {
      throw new HttpException(await this.translationService.translate('error.PASSWORD_INCORRECT'), HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register user' })
  @ApiInternalServerErrorResponse()
  @ApiConflictResponse()
  @ApiCreatedResponse({ type: LoginResponse })
  async register(@Body() body: RegisterDto): Promise<{ accessToken: string }> {
    if (await this.userService.checkUnknownUser(body)) {
      throw new HttpException(await this.translationService.translate('error.USER_EXIST'), HttpStatus.CONFLICT);
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