import { Body, Controller, HttpException, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

import { LoginDto } from '@/auth/dto/login.dto';
import { LoginResponse } from '@/auth/dto/loginResponse';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from '@/auth/service/auth.service';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService) {}
    
    @UsePipes(ValidationPipe)
    @Post('/login')
    @ApiOperation({ summary: 'Login user' })
    @ApiResponse({ status: 401, description: 'Bad request.' })
    @ApiResponse({ status: 201, description: 'User logged', type: LoginResponse })
    async Login(@Body() body: LoginDto) {
        const user = await this.userService.findOneEmail(body.email);
        if (!user) throw new HttpException("Aucun email associé à ce compte", 401);
        if (!await comparePassword(body.password, user.password)) throw new HttpException('Mot de passe incorrect', 401);
        return this.authService.login(user);
    }

    @UsePipes(ValidationPipe)
    @Post('/register')
    @ApiOperation({ summary: 'Register user' })
    @ApiResponse({ status: 409, description: 'User already exist.' })
    @ApiResponse({ status: 201, description: 'User created', type: User })
    async SignUp(@Body() body: RegisterDto): Promise<{}> {
        if (await this.userService.checkUnknownUser(body)) throw new HttpException('L\'utilisateur existe déjà', 409);
        body.password = await hashPassword(body.password);
        const user = await this.userService.create(body);
        if (!user) throw new HttpException("L'utilisateur n'a pas pu être créé", 400);
        return this.authService.login(user);
    }
}

async function hashPassword(plaintextPassword: string) {
    return bcrypt.hash(plaintextPassword, 10);
}

async function comparePassword(plaintextPassword: string, hash: string) {
    return bcrypt.compare(plaintextPassword, hash);
}