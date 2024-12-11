import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@/auth/controller/auth.controller';
import { AuthService } from '@/auth/service/auth.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@playpal/schemas';
import { FileUploadService } from '@/files/files.service';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: Partial<AuthService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockFileUploadService: Partial<FileUploadService>

  beforeEach(async () => {
    mockFileUploadService = {};
    
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
        { provide: FileUploadService, useValue: mockFileUploadService },
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
        rating: []
      };

      jest.spyOn(mockUserService, 'findOneEmail').mockResolvedValue(mockUser);
      jest.spyOn(mockAuthService, 'login').mockReturnValue({ accessToken: 'test-token' });

      const mockSend = jest.fn();
      const response = { cookie: jest.fn(), send: mockSend} as unknown as Response;
      
      await authController.login(loginDto, response);

      expect(mockUserService.findOneEmail).toHaveBeenCalledWith(loginDto.email);
      expect(response.cookie).toHaveBeenCalledWith(
        'access_token',
        'test-token',
        expect.objectContaining({ httpOnly: true })
      );
      expect(mockSend).toHaveBeenCalledWith({ accessToken: 'test-token' });
    });

    it('should throw NotFoundExeption for non-existent user', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(mockUserService, 'findOneEmail').mockResolvedValue(null);

      const response = { cookie: jest.fn(), send: jest.fn()} as unknown as Response;

      await expect(authController.login(loginDto, response)).rejects.toThrow(HttpException);
      await expect(authController.login(loginDto, response)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw NotFoundException for incorrect password', async () => {
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
        rating: []
      };

      jest.spyOn(mockUserService, 'findOneEmail').mockResolvedValue(mockUser);

      const response = { cookie: jest.fn(), send: jest.fn()} as unknown as Response;

      await expect(authController.login(loginDto, response)).rejects.toThrow(HttpException);
      await expect(authController.login(loginDto, response)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
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
        creationDate: new Date(),
        rating: []
      };

      const mockSend = jest.fn();
      const response = { cookie: jest.fn(), send: mockSend} as unknown as Response;

      jest.spyOn(mockUserService, 'checkUnknownUser').mockResolvedValue(false);
      jest.spyOn(mockUserService, 'create').mockResolvedValue(mockCreatedUser);

      const result = await authController.register(registerDto, response);

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

      const mockSend = jest.fn();
      const response = { cookie: jest.fn(), send: mockSend} as unknown as Response;

      await expect(authController.register(registerDto, response)).rejects.toThrow(HttpException);
      await expect(authController.register(registerDto, response)).rejects.toMatchObject({
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

      const mockSend = jest.fn();
      const response = { cookie: jest.fn(), send: mockSend} as unknown as Response;

      await expect(authController.register(registerDto, response)).rejects.toThrow(HttpException);
      await expect(authController.register(registerDto, response)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
