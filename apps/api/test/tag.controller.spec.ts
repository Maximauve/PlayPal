import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from '@/tag/controller/tag.controller';
import { TagService } from '@/tag/service/tag.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Tag, Role, Game } from '@playpal/schemas';
import { TagDto } from '@/tag/dto/tag.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TagUpdatedDto } from '@/tag/dto/tagUpdated.dto';
import { GameService } from '@/game/service/game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    brand: "Magilano",
    rating: [],
    tags: mockTags,
    rules: [],
    averageRating: 2,
    count: []
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
    mockTagRepository = {};
    mockGameRepository = {};
    
    mockTagService = {
      getAll: jest.fn().mockResolvedValue(mockTags),
      getOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getOneByName: jest.fn(),
      getAllByGameId: jest.fn().mockResolvedValue(mockGame.tags),
      checkIsInGame: jest.fn()
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
      const result = tagController.getOne(mockTags[0]);
      expect(result).toEqual(mockTags[0]);
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const newTag: TagDto = {
        name: 'Nouveau tag'
      };

      jest.spyOn(mockTagService, 'create').mockResolvedValue(mockTags[0]);

      const result = await tagController.create(newTag);
      expect(result).toEqual(mockTags[0]);
      expect(mockTagService.create).toHaveBeenCalledWith(newTag);
    });

    it('should throw an error if the tag could not be created', async () => {
      const newTag: TagDto = {
        name: 'Nouveau tag'
      };

      jest.spyOn(mockTagService, 'create').mockResolvedValue(null);

      await expect(tagController.create(newTag))
        .rejects.toThrow(HttpException);

      await expect(tagController.create(newTag))
        .rejects.toMatchObject({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const updatedDtoTag: TagUpdatedDto = {
        name: 'Tag mis à jour'
      };

      const updatedTag: Tag = {
        ...mockTags[0],
        ...updatedDtoTag
      }

      jest.spyOn(mockTagService, 'update').mockResolvedValue();

      jest.spyOn(mockTagService, 'getOne').mockResolvedValue(updatedTag);

      const result = await tagController.update(mockTags[0], updatedDtoTag);
      expect(result).toEqual(updatedTag);
      expect(mockTagService.update).toHaveBeenCalledWith(mockTags[0].id, updatedDtoTag);
      expect(mockTagService.getOne).toHaveBeenCalledWith(mockTags[0].id);
    });
  });

  describe('delete', () => {
    it('should delete a tag', async () => {
      jest.spyOn(mockTagService, 'delete').mockResolvedValue();

      const result = await tagController.delete(mockTags[0]);
      expect(result).toBeUndefined();
      expect(mockTagService.delete).toHaveBeenCalledWith(mockTags[0].id);
    });

    it('should throw an error if the tag is used by a game', async () => {
      jest.spyOn(mockTagService, 'delete').mockRejectedValue(new HttpException('', HttpStatus.CONFLICT));

      await expect(tagController.delete(mockTags[0]))
        .rejects.toThrow(HttpException);

      await expect(tagController.delete(mockTags[0]))
        .rejects.toMatchObject({
          status: HttpStatus.CONFLICT,
      });
    });
  });
});
