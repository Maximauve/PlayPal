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

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let translationService: TranslationService;

  const mockUser: User = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    role: Role.Customer,
    password: 'hashed-password',
    creationDate: new Date()
  };

  const adminUser: User = {
    ...mockUser,
    role: Role.Admin,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getAll: jest.fn(),
            findOneUser: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            checkUnknownUser: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {},
        },
        {
          provide: TranslationService,
          useValue: {
            translate: jest.fn((key) => Promise.resolve(key)),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    translationService = module.get<TranslationService>(TranslationService);
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [mockUser];
      jest.spyOn(userService, 'getAll').mockResolvedValue(users);

      expect(await controller.getAll()).toEqual(users);
    });
  });

  describe('getMe', () => {
    it('should return the current user', () => {
      expect(controller.getMe(mockUser)).toEqual(mockUser);
    });
  });

  describe('getOneUser', () => {
    it('should return a user by ID', () => {
      expect(controller.getOneUser(mockUser)).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update the user if authorized', async () => {
      const userUpdateData: UserUpdatedDto = { username: 'updatedUser' };
      const updatedUser: User = { ...mockUser, ...userUpdateData };

      jest.spyOn(userService, 'checkUnknownUser').mockResolvedValue(false);
      jest.spyOn(userService, 'update').mockResolvedValue(undefined);
      jest.spyOn(userService, 'findOneUser').mockResolvedValue(updatedUser);

      const result = await controller.update(mockUser, mockUser, userUpdateData);
      expect(result).toEqual(updatedUser);
      expect(userService.update).toHaveBeenCalledWith(mockUser.id, userUpdateData);
    });

    it('should throw conflict error if user already exists', async () => {
      jest.spyOn(userService, 'checkUnknownUser').mockResolvedValue(true);

      await expect(controller.update(mockUser, mockUser, {})).rejects.toThrow(
        new HttpException('error.USER_EXIST', HttpStatus.CONFLICT),
      );
    });

    it('should throw unauthorized error if user is not admin or updating own account', async () => {
      const nonAdminUser: User = { ...mockUser, id: 'another-id' };
      jest.spyOn(translationService, 'translate').mockResolvedValue('error.USER_NOT_ADMIN');

      await expect(controller.update(nonAdminUser, mockUser, {})).rejects.toThrow(
        new HttpException('error.USER_NOT_ADMIN', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('delete', () => {
    it('should delete the user if authorized', async () => {
      const deleteSpy = jest.spyOn(userService, 'delete').mockResolvedValue(undefined);

      await controller.delete(adminUser, mockUser);
      expect(deleteSpy).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw unauthorized error if user is not admin or deleting own account', async () => {
      const nonAdminUser: User = { ...mockUser, id: 'another-id' };
      jest.spyOn(translationService, 'translate').mockResolvedValue('error.USER_NOT_ADMIN');

      await expect(controller.delete(nonAdminUser, mockUser)).rejects.toThrow(
        new HttpException('error.USER_NOT_ADMIN', HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
