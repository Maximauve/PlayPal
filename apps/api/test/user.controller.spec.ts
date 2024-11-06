import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/user/controller/user.controller';
import { UserService } from '@/user/service/user.service';
import { RedisService } from '@/redis/service/redis.service';
import { TranslationService } from '@/translation/translation.service';
import { UserUpdatedDto } from '@/user/dto/userUpdated';
import { User } from '@/user/user.entity';
import { Role } from '@/user/role.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: Partial<UserService>;
  let mockRedisService: Partial<RedisService>;
  let mockTranslationService: Partial<TranslationService>;

  const mockUsers: User[] = [
    {
      id: "8a1f0b74-123e-4b97-9db3-0281a63c2072",
      email: 'user1@example.com',
      username: "John doe",
      creationDate: new Date(),
      role: Role.Customer,
      password: 'hashedpassword1'
    },
    {
      id: "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3",
      email: 'user2@example.com',
      username: "John doe",
      creationDate: new Date(),
      role: Role.Admin,
      password: 'hashedpassword2'
    }
  ];

  beforeEach(async () => {
    mockUserService = {
      getAll: jest.fn().mockResolvedValue(mockUsers),
      findOneUser: jest.fn(),
      getUserConnected: jest.fn(),
      checkUnknownUser: jest.fn().mockResolvedValue(false),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockRedisService = {};

    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const result = await userController.getAll();
      expect(result).toEqual(mockUsers);
      expect(mockUserService.getAll).toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it('should return current user details', async () => {
      const mockRequest = {
        user: { id: "8a1f0b74-123e-4b97-9db3-0281a63c2072", email: 'user1@example.com' }
      } as any;

      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue(mockUsers[0]);

      const result = await userController.getMe(mockRequest);
      expect(result).toEqual(mockUsers[0]);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith(mockRequest.user.id);
    });

    it('should throw exception if user not found', async () => {
      const mockRequest = {
        user: { id: '999', email: 'nonexistent@example.com' }
      } as any;

      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue(null);

      await expect(userController.getMe(mockRequest)).rejects.toThrow(HttpException);
      await expect(userController.getMe(mockRequest)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('getOneUser', () => {
    it('should return a specific user by ID', async () => {
      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue(mockUsers[0]);

      const result = await userController.getOneUser("8a1f0b74-123e-4b97-9db3-0281a63c2072");
      expect(result).toEqual(mockUsers[0]);
      expect(mockUserService.findOneUser).toHaveBeenCalledWith("8a1f0b74-123e-4b97-9db3-0281a63c2072");
    });

    it('should throw exception if user not found', async () => {
      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue(null);

      await expect(userController.getOneUser('999')).rejects.toThrow(HttpException);
      await expect(userController.getOneUser('999')).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('update', () => {
    it('should allow admin to update any user', async () => {
      const mockRequest = {
        user: { id: "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3", role: Role.Admin }
      } as any;

      const updateDto: UserUpdatedDto = {
        email: 'updated@example.com',
        username: 'Updated',
        role: Role.Admin
      };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUsers[1]);
      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue({
        ...mockUsers[0],
        ...updateDto
      } as User);

      const result = await userController.update(mockRequest, "8a1f0b74-123e-4b97-9db3-0281a63c2072", updateDto);
      
      expect(mockUserService.update).toHaveBeenCalledWith("8a1f0b74-123e-4b97-9db3-0281a63c2072", updateDto);
      expect(result.email).toBe(updateDto.email);
    });

    it('should allow user to update their own profile', async () => {
      const mockRequest = {
        user: { id: "8a1f0b74-123e-4b97-9db3-0281a63c2072", role: Role.Customer }
      } as any;

      const updateDto: UserUpdatedDto = {
        email: 'updated@example.com',
        username: 'Updated'
      };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUsers[0]);
      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue({
        ...mockUsers[0],
        ...updateDto
      } as User);

      const result = await userController.update(mockRequest, "8a1f0b74-123e-4b97-9db3-0281a63c2072", updateDto);
      
      expect(mockUserService.update).toHaveBeenCalledWith("8a1f0b74-123e-4b97-9db3-0281a63c2072", updateDto);
      expect(result.email).toBe(updateDto.email);
    });

    it('should prevent user from updating another user', async () => {
      const mockRequest = {
        user: { id: "8a1f0b74-123e-4b97-9db3-0281a63c2072", role: Role.Customer }
      } as any;

      const updateDto: UserUpdatedDto = {
        email: 'updated@example.com'
      };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUsers[0]);

      await expect(userController.update(mockRequest, "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3", updateDto)).rejects.toThrow(HttpException);
      await expect(userController.update(mockRequest, "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3", updateDto)).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
      });
    });

    it('should hash password if provided', async () => {
      const mockRequest = {
        user: { id: "8a1f0b74-123e-4b97-9db3-0281a63c2072", role: Role.Admin }
      } as any;
      const password = 'newpassword123'
      const updateDto: UserUpdatedDto = {
        password: password
      };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUsers[1]);
      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue(mockUsers[0]);

      await userController.update(mockRequest, "8a1f0b74-123e-4b97-9db3-0281a63c2072", updateDto);
      
      const updateCall = (mockUserService.update as jest.Mock).mock.calls[0];
      expect(updateCall[1].password).not.toBe(password);
      expect(await bcrypt.compare(password as string, updateCall[1].password)).toBe(true);
    });
  });

  describe('delete', () => {
    it('should allow admin to delete any user', async () => {
      const mockRequest = {
        user: { id: "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3", role: Role.Admin }
      } as any;

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUsers[1]);

      await userController.delete(mockRequest, "8a1f0b74-123e-4b97-9db3-0281a63c2072");
      
      expect(mockUserService.delete).toHaveBeenCalledWith("8a1f0b74-123e-4b97-9db3-0281a63c2072");
    });

    it('should allow user to delete their own profile', async () => {
      const mockRequest = {
        user: { id: "8a1f0b74-123e-4b97-9db3-0281a63c2072", role: Role.Customer }
      } as any;

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUsers[0]);

      await userController.delete(mockRequest, "8a1f0b74-123e-4b97-9db3-0281a63c2072");
      
      expect(mockUserService.delete).toHaveBeenCalledWith("8a1f0b74-123e-4b97-9db3-0281a63c2072");
    });

    it('should prevent user from deleting another user', async () => {
      const mockRequest = {
        user: { id: "8a1f0b74-123e-4b97-9db3-0281a63c2072", role: Role.Customer }
      } as any;

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUsers[0]);

      await expect(userController.delete(mockRequest, "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3")).rejects.toThrow(HttpException);
      await expect(userController.delete(mockRequest, "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3")).rejects.toMatchObject({
        status: HttpStatus.UNAUTHORIZED,
      });
    });
  });
});