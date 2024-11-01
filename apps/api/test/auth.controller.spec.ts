import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@/auth/controller/auth.controller';
import { AuthService } from '@/auth/service/auth.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@/user/role.enum';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: Partial<AuthService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn().mockResolvedValue({ accessToken: 'test-token' }),
    };

    mockUserService = {
      findOneEmail: jest.fn(),
      checkUnknownUser: jest.fn(),
      create: jest.fn(),
    };

    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: "1",
        username: "oui",
        creationDate: new Date(),
        role: Role.Customer,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      jest.spyOn(mockUserService, 'findOneEmail').mockResolvedValue(mockUser);

      const result = await authController.login(loginDto);

      expect(mockUserService.findOneEmail).toHaveBeenCalledWith(loginDto.email);
      expect(result).toEqual({ accessToken: 'test-token' });
    });

    it('should throw NotFoundExeption for non-existent user', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(mockUserService, 'findOneEmail').mockResolvedValue(null);

      await expect(authController.login(loginDto)).rejects.toThrow(HttpException);
      await expect(authController.login(loginDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw UnauthorizedException for incorrect password', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: "2",
        creationDate: new Date(),
        role: Role.Customer,
        username: "oui",
        email: 'test@example.com',
        password: await bcrypt.hash('correctpassword', 10),
      };

      jest.spyOn(mockUserService, 'findOneEmail').mockResolvedValue(mockUser);

      await expect(authController.login(loginDto)).rejects.toThrow(HttpException);
      await expect(authController.login(loginDto)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
      });
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'John',
      };

      const mockCreatedUser = {
        id: "3",
        ...registerDto,
        password: await bcrypt.hash(registerDto.password, 10),
        role: Role.Customer,
        creationDate: new Date()
      };

      jest.spyOn(mockUserService, 'checkUnknownUser').mockResolvedValue(false);
      jest.spyOn(mockUserService, 'create').mockResolvedValue(mockCreatedUser);

      const result = await authController.register(registerDto);

      expect(mockUserService.checkUnknownUser).toHaveBeenCalledWith(registerDto);
      expect(mockUserService.create).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: 'test-token' });
    });

    it('should throw ConflictException for existing user', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        username: "John Doe"
      };

      jest.spyOn(mockUserService, 'checkUnknownUser').mockResolvedValue(true);

      await expect(authController.register(registerDto)).rejects.toThrow(HttpException);
      await expect(authController.register(registerDto)).rejects.toMatchObject({
        status: HttpStatus.CONFLICT,
      });
    });

    it('should throw InternalServerErrorException if user creation fails', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        username: "John Doe"
      };

      jest.spyOn(mockUserService, 'checkUnknownUser').mockResolvedValue(false);
      jest.spyOn(mockUserService, 'create').mockResolvedValue(null);

      await expect(authController.register(registerDto)).rejects.toThrow(HttpException);
      await expect(authController.register(registerDto)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});