import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/user/controller/user.controller';
import { UserService } from '@/user/service/user.service';
import { RedisService } from '@/redis/service/redis.service';
import { TranslationService } from '@/translation/translation.service';
import { User } from '@/user/user.entity';
import { Role } from '@/user/role.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { UserUpdatedDto } from '@/user/dto/userUpdated';
import { FileUploadService } from '@/files/files.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockFileUploadService: Partial<FileUploadService>;
  let mockUserRepository: Partial<Repository<User>>;

  const mockUser: User = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    role: Role.Customer,
    password: 'hashed-password',
    creationDate: new Date(),
  };

  const adminUser: User = {
    ...mockUser,
    role: Role.Admin,
  };

  const mockUsers: User[] = [mockUser, adminUser];

  beforeEach(async () => {
    mockUserService = {
      getAll: jest.fn().mockResolvedValue(mockUsers),
      findOneUser: jest.fn().mockImplementation((id: string) =>
        Promise.resolve(mockUsers.find((user) => user.id === id)),
      ),
      update: jest.fn().mockResolvedValue({ ...mockUser, username: 'updatedUser' }),
      delete: jest.fn().mockResolvedValue(undefined),
      checkUnknownUser: jest.fn().mockResolvedValue(false),
    };

    mockTranslationService = {
      translate: jest.fn((key) => Promise.resolve(`${key}`)),
    };

    mockFileUploadService = {
      uploadFile: jest.fn().mockResolvedValue({ url: 'http://example.com/file.jpg' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: FileUploadService, useValue: mockFileUploadService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [mockUser];
      jest.spyOn(mockUserService, 'getAll').mockResolvedValue(users);

      expect(await userController.getAll()).toEqual(users);
    });
  });

  describe('getMe', () => {
    it('should return the current user', () => {
      expect(userController.getMe(mockUser)).toEqual(mockUser);
    });
  });

  describe('getOneUser', () => {
    it('should return a user by ID', () => {
      expect(userController.getOneUser(mockUser)).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update the user if authorized', async () => {
      const userUpdateData: UserUpdatedDto = { username: 'updatedUser' };
      const updatedUser: User = { ...mockUser, ...userUpdateData };

      jest.spyOn(mockUserService, 'checkUnknownUser').mockResolvedValue(false);
      jest.spyOn(mockUserService, 'update').mockResolvedValue(undefined);
      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue(updatedUser);

      const result = await userController.update(mockUser, mockUser, userUpdateData);
      expect(result).toEqual(updatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith(mockUser.id, userUpdateData);
    });

    it('should throw conflict error if user already exists', async () => {
      jest.spyOn(mockUserService, 'checkUnknownUser').mockResolvedValue(true);

      await expect(userController.update(mockUser, mockUser, {})).rejects.toThrow(
        new HttpException('error.USER_EXIST', HttpStatus.CONFLICT),
      );
    });

    it('should throw unauthorized error if user is not admin or updating own account', async () => {
      const nonAdminUser: User = { ...mockUser, id: 'another-id' };
      jest.spyOn(mockTranslationService, 'translate').mockResolvedValue('error.USER_NOT_ADMIN');

      await expect(userController.update(nonAdminUser, mockUser, {})).rejects.toThrow(
        new HttpException('error.USER_NOT_ADMIN', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('delete', () => {
    it('should delete the user if authorized', async () => {
      const deleteSpy = jest.spyOn(mockUserService, 'delete').mockResolvedValue(undefined);

      await userController.delete(adminUser, mockUser);
      expect(deleteSpy).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw unauthorized error if user is not admin or deleting own account', async () => {
      const nonAdminUser: User = { ...mockUser, id: 'another-id' };
      jest.spyOn(mockTranslationService, 'translate').mockResolvedValue('error.USER_NOT_ADMIN');

      await expect(userController.delete(nonAdminUser, mockUser)).rejects.toThrow(
        new HttpException('error.USER_NOT_ADMIN', HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
