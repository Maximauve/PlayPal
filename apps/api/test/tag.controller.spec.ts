import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from '@/tag/controller/tag.controller';
import { TagService } from '@/tag/service/tag.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Tag } from '@/tag/tag.entity';
import { TagDto } from '@/tag/dto/tag.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Role } from '@/user/role.enum';
import { TagUpdatedDto } from '@/tag/dto/tagUpdated.dto';

describe('TagController', () => {
  let tagController: TagController;
  let mockTagService: Partial<TagService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;

  const mockTags: Tag[] = [
    {
      id: "8a1f0b74-123e-4b97-9db3-0281a63c2072",
      name: 'Coopératif'
    },
    {
      id: "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3",
      name: 'Jeux d\'ambiance'
    }
  ];

  const mockUser = {
    id: "0192fcf0-c140-7d88-983c-dcdd28c28f03",
    email: 'user@example.com',
    username: "John doe",
    creationDate: new Date(),
    role: Role.Customer,
    password: 'hashedpassword'
  };

  beforeEach(async () => {
    mockTagService = {
      getAll: jest.fn().mockResolvedValue(mockTags),
      getOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getOneByName: jest.fn(),
    };

    mockUserService = {
      getUserConnected: jest.fn().mockResolvedValue(mockUser),
    };

    mockTranslationService = {
      translate: jest.fn().mockResolvedValue((key: any) => `Translated: ${key}`),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        { provide: TagService, useValue: mockTagService },
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
      ],
    }).compile();

    tagController = module.get<TagController>(TagController);
  });

  describe('getAll', () => {
    it('should return all tags', async () => {
      expect(await tagController.getAll()).toEqual(mockTags);
      expect(mockTagService.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a specific tag by id', async () => {
      jest.spyOn(mockTagService, 'getOne').mockResolvedValue(mockTags[0]);

      const result = await tagController.getOne({} as any, mockTags[0].id);
      expect(result).toEqual(mockTags[0]);
      expect(mockTagService.getOne).toHaveBeenCalledWith(mockTags[0].id);
    });

    it('should throw an error if the tag does not exist', async () => {
      jest.spyOn(mockTagService, 'getOne').mockResolvedValue(null);

      await expect(tagController.getOne({} as any, 'unknown-id'))
        .rejects.toThrow(HttpException);

      await expect(tagController.getOne({} as any, 'unknown-id'))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw an unauthorized error if the user is not connected', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(tagController.getOne({} as any, 'unknown-id'))
        .rejects.toThrow(HttpException);

      await expect(tagController.getOne({} as any, 'unknown-id'))
        .rejects.toMatchObject({
          status: HttpStatus.UNAUTHORIZED,
      });
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const newTag: TagDto = {
        name: 'Nouveau tag'
      };

      jest.spyOn(mockTagService, 'create').mockResolvedValue(mockTags[0]);

      const result = await tagController.create({} as any, newTag);
      expect(result).toEqual(mockTags[0]);
      expect(mockTagService.create).toHaveBeenCalledWith(newTag);
    });

    it('should throw an error if the tag could not be created', async () => {
      const newTag: TagDto = {
        name: 'Nouveau tag'
      };

      jest.spyOn(mockTagService, 'create').mockResolvedValue(null);

      await expect(tagController.create({} as any, newTag))
        .rejects.toThrow(HttpException);

      await expect(tagController.create({} as any, newTag))
        .rejects.toMatchObject({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });

    it('should throw an unauthorized error if the user is not connected', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(tagController.create({} as any, {} as any))
        .rejects.toThrow(HttpException);

      await expect(tagController.create({} as any, {} as any))
        .rejects.toMatchObject({
          status: HttpStatus.UNAUTHORIZED,
      });
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const updatedTag: TagUpdatedDto = {
        name: 'Tag mis à jour'
      };

      jest.spyOn(mockTagService, 'update').mockResolvedValue();

      jest.spyOn(mockTagService, 'getOne').mockResolvedValue(mockTags[0]);

      const result = await tagController.update({} as any, mockTags[0].id, updatedTag);
      expect(result).toEqual(mockTags[0]);
      expect(mockTagService.update).toHaveBeenCalledWith(mockTags[0].id, updatedTag);
      expect(mockTagService.getOne).toHaveBeenCalledWith(mockTags[0].id);
    });

    it('should throw an error if the tag does not exist', async () => {
      const updatedTag: TagUpdatedDto = {
        name: 'Tag mis à jour'
      };

      jest.spyOn(mockTagService, 'update').mockRejectedValue(new HttpException('Tag not found', HttpStatus.NOT_FOUND));

      await expect(tagController.update({} as any, 'unknown-id', updatedTag))
        .rejects.toThrow(HttpException);

      await expect(tagController.update({} as any, 'unknown-id', updatedTag))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw an unauthorized error if the user is not connected', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(tagController.update({} as any, 'unknown-id', {} as any))
        .rejects.toThrow(HttpException);

      await expect(tagController.update({} as any, 'unknown-id', {} as any))
        .rejects.toMatchObject({
          status: HttpStatus.UNAUTHORIZED,
      });
    });
  });

  describe('delete', () => {
    it('should delete a tag', async () => {
      jest.spyOn(mockTagService, 'delete').mockResolvedValue();

      const result = await tagController.delete({} as any, mockTags[0].id);
      expect(result).toBeUndefined();
      expect(mockTagService.delete).toHaveBeenCalledWith(mockTags[0].id);
    });

    it('should throw an error if the tag does not exist', async () => {
      jest.spyOn(mockTagService, 'delete').mockRejectedValue(new HttpException('Tag not found', HttpStatus.NOT_FOUND));

      await expect(tagController.delete({} as any, 'unknown-id'))
        .rejects.toThrow(HttpException);

      await expect(tagController.delete({} as any, 'unknown-id'))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw an unauthorized error if the user is not connected', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(tagController.delete({} as any, 'unknown-id'))
        .rejects.toThrow(HttpException);

      await expect(tagController.delete({} as any, 'unknown-id'))
        .rejects.toMatchObject({
          status: HttpStatus.UNAUTHORIZED,
      });
    });
  });
});