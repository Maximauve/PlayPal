import { Body, Controller, HttpException, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';

import { LoginDto } from '@/auth/dto/login.dto';
import { LoginResponse } from '@/auth/dto/loginResponse';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from '@/auth/service/auth.service';
import { TranslationService } from '@/translation/translation.service';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly translationService: TranslationService) {}
    
  @Post('/login')
  @UseFilters(new I18nValidationExceptionFilter())
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Incorrect email or password.' })
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: LoginResponse })
  async Login(@Body() body: LoginDto) {
    const user = await this.userService.findOneEmail(body.email);
    if (!user) {
      throw new HttpException(await this.translationService.translate('error.USER_EXIST'), HttpStatus.UNAUTHORIZED);
    }
    if (!await comparePassword(body.password, user.password)) {
      throw new HttpException(await this.translationService.translate('error.PASSWORD_INCORRECT'), HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Post('/register')
  @UseFilters(new I18nValidationExceptionFilter())
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 409, description: 'User already exist.' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  async SignUp(@Body() body: RegisterDto): Promise<{}> {
    console.log(body);
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