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
import { GameService } from '@/game/service/game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '@/game/game.entity';

describe('TagController', () => {
  let tagController: TagController;
  let mockTagService: Partial<TagService>;
  let mockUserService: Partial<UserService>;
  let mockGameService: Partial<GameService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockTagRepository: Partial<Repository<Tag>>;
  let mockGameRepository: Partial<Repository<Game>>;

  const mockTags: Tag[] = [
    {
      id: "8a1f0b74-123e-4b97-9db3-0281a63c2072",
      name: 'Coopératif',
      games: []
    },
    {
      id: "3f78f9c0-4a5d-437b-8db2-531ac1d9e0b3",
      name: 'Jeux d\'ambiance',
      games: []
    }
  ];

  const mockGame = {
    id: "568931ed-d87e-4bf1-b477-2f1aea83e3da",
    name: "6-qui-prends",
    description: "Un jeu de taureaux",
    minPlayers: 3,
    maxPlayers: 8,
    duration: "45",
    difficulty: 3,
    minYear: 10,
    rating: [],
    tags: [mockTags[0], mockTags[1]]
  };

  const mockUser = {
    id: "0192fcf0-c140-7d88-983c-dcdd28c28f03",
    email: 'user@example.com',
    username: "John doe",
    creationDate: new Date(),
    role: Role.Customer,
    password: 'hashedpassword',
    rating: []
  };

  beforeEach(async () => {
    mockTagService = {
      getAll: jest.fn().mockResolvedValue(mockTags),
      getOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getOneByName: jest.fn(),
      getAllByGameId: jest.fn().mockResolvedValue(mockGame.tags),
    };

    mockUserService = {
      getUserConnected: jest.fn().mockResolvedValue(mockUser),
    };

    mockGameService = {
      findOneGame: jest.fn().mockResolvedValue(mockGame),
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
        { provide: GameService, useValue: mockGameService },
        { provide: getRepositoryToken(Tag), useValue: mockTagRepository },
        { provide: getRepositoryToken(Game), useValue: mockGameRepository },

      ],
    }).compile();

    tagController = module.get<TagController>(TagController);
  });

  describe('getAll', () => {
    it('should return all tags', async () => {
      expect(await tagController.getAllTags()).toEqual(mockTags);
      expect(mockTagService.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a specific tag by id', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockTagService, 'getOne').mockResolvedValue(mockTags[0]);

      const result = await tagController.getOne({} as any, mockTags[0].id);
      expect(result).toEqual(mockTags[0]);
      expect(mockTagService.getOne).toHaveBeenCalledWith(mockTags[0].id);
    });

    it('should throw an error if the tag does not exist', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockTagService, 'getOne').mockResolvedValue(null);

      await expect(tagController.getOne({} as any, 'unknown-id'))
        .rejects.toThrow(HttpException);

      await expect(tagController.getOne({} as any, 'unknown-id'))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('getAllTagsByGame', () => {
    it('should return all tags for a specific game', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);

      const result = await tagController.getAllTagsByGame({} as any, mockGame.id);
      expect(result).toEqual(mockGame.tags);
      expect(mockGameService.findOneGame).toHaveBeenCalledWith(mockGame.id);
    });

    it('should throw an error if the game does not exist', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(tagController.getAllTagsByGame({} as any, 'unknown-id'))
        .rejects.toThrow(HttpException);

      await expect(tagController.getAllTagsByGame({} as any, 'unknown-id'))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const newTag: TagDto = {
        name: 'Nouveau tag'
      };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockTagService, 'create').mockResolvedValue(mockTags[0]);

      const result = await tagController.create({} as any, newTag);
      expect(result).toEqual(mockTags[0]);
      expect(mockTagService.create).toHaveBeenCalledWith(newTag);
    });

    it('should throw an error if the tag could not be created', async () => {
      const newTag: TagDto = {
        name: 'Nouveau tag'
      };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockTagService, 'create').mockResolvedValue(null);

      await expect(tagController.create({} as any, newTag))
        .rejects.toThrow(HttpException);

      await expect(tagController.create({} as any, newTag))
        .rejects.toMatchObject({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const updatedTag: TagUpdatedDto = {
        name: 'Tag mis à jour'
      };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
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
      
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockTagService, 'update').mockRejectedValue(new HttpException('Tag not found', HttpStatus.NOT_FOUND));

      await expect(tagController.update({} as any, 'unknown-id', updatedTag))
        .rejects.toThrow(HttpException);

      await expect(tagController.update({} as any, 'unknown-id', updatedTag))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
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

      await expect(tagController.delete({} as any, 'ae95075c-e46d-4007-a33f-4aff22d61221'))
        .rejects.toThrow(HttpException);

      await expect(tagController.delete({} as any, 'ae95075c-e46d-4007-a33f-4aff22d61221'))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw an error if the id is not valid', async () => {
      jest.spyOn(mockTagService, 'delete').mockRejectedValue(new HttpException('Invalid id', HttpStatus.BAD_REQUEST));

      await expect(tagController.delete({} as any, 'invalid-id'))
        .rejects.toThrow(HttpException);

      await expect(tagController.delete({} as any, 'invalid-id'))
        .rejects.toMatchObject({
          status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw an error if the tag is used by a game', async () => {
      jest.spyOn(mockTagService, 'delete').mockRejectedValue(new HttpException('Tag is used by a game', HttpStatus.CONFLICT));

      await expect(tagController.delete({} as any, 'ae95075c-e46d-4007-a33f-4aff22d61221'))
        .rejects.toThrow(HttpException);

      await expect(tagController.delete({} as any, 'ae95075c-e46d-4007-a33f-4aff22d61221'))
        .rejects.toMatchObject({
          status: HttpStatus.CONFLICT,
      });
    });
  });
});