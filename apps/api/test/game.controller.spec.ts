import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from '@/game/controller/game.controller';
import { GameService } from '@/game/service/game.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { GameDto } from '@/game/dto/game.dto';
import { GameUpdatedDto } from '@/game/dto/gameUpdated.dto';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag, Game, Role } from '@playpal/schemas';
import { FileUploadService } from '@/files/files.service';

describe('GameController', () => {
  let gameController: GameController;
  let mockGameService: Partial<GameService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockFileUploadService: Partial<FileUploadService>
  let mockGameRepository: Partial<Repository<Game>>;

  const mockGames: Game[] = [
    {
      id: "568931ed-d87e-4bf1-b477-2f1aea83e3da",
      name: "6-qui-prends",
      description: "Un jeu de taureaux",
      minPlayers: 3,
      maxPlayers: 8,
      duration: "45",
      difficulty: 3,
      minYear: 10,
      brand: "Gigamic",
      rating: [],
      tags: [],
      rules: []
    },
    {
      id: "109ebba9-9823-45bf-88b5-889c621d58f9",
      name: "Skyjo",
      description: "Un jeu de couleurs",
      minPlayers: 2,
      maxPlayers: 8,
      duration: "35",
      difficulty: 1,
      minYear: 3,
      brand: "Magilano",
      rating: [],
      tags: [],
      rules: []
    }
  ];

  const mockUser = {
    id: "67cdb566-710d-41cc-87b8-401805a6ba72",
    email: 'user2@example.com',
    username: "John doe",
    creationDate: new Date(),
    role: Role.Customer,
    password: 'hashedpassword2'
  }

  beforeEach(async () => {
    mockGameService = {
      getAll: jest.fn().mockResolvedValue(mockGames),
      findOneGame: jest.fn(),
      findOneName: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserService = {
      getUserConnected: jest.fn().mockResolvedValue(mockUser),
    };

    mockTranslationService = {
      translate: jest.fn().mockImplementation(key => `Translated: ${key}`),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: FileUploadService, useValue: mockFileUploadService },
        { provide: getRepositoryToken(Game), useValue: mockGameRepository },
      ],
    }).compile();

    gameController = module.get<GameController>(GameController);
  });

  describe('getAll', () => {
    it('should return all games', async () => {
      const result = await gameController.getAll();
      expect(result).toEqual(mockGames);
    });
  });

  describe('getOneGame', () => {

    it('should return a specific game by ID', async () => {
      const result = gameController.getOneGame(mockGames[0]);
      expect(result).toEqual(mockGames[0]);
    });
  });

  describe('create', () => {
    const createGameDto: GameDto = {
      name: "6-qui-prends",
      description: "Un jeu de taureaux",
      minPlayers: 3,
      maxPlayers: 8,
      duration: "45",
      difficulty: 3,
      minYear: 10,
      brand: "Gigamic",
    }

    it('should create a new game successfully', async () => {
      jest.spyOn(mockGameService, 'create').mockResolvedValue(mockGames[0]);

      const result = await gameController.create(createGameDto);
      expect(result).toEqual(mockGames[0]);
      expect(mockGameService.create).toHaveBeenCalledWith(createGameDto);
    });

    it('should throw exception if game creation fails', async () => {
      jest.spyOn(mockGameService, 'create').mockResolvedValue(null);

      await expect(gameController.create(createGameDto))
        .rejects.toThrow(HttpException);
      await expect(gameController.create(createGameDto))
        .rejects.toMatchObject({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    });
  });

  describe('update', () => {
    const updateGameDto: GameUpdatedDto = {
      description: "Description updated",
      minYear: 12
    };

    it('should update a game successfully', async () => {
      const updatedGame = { ...mockGames[0], ...updateGameDto };
      
      jest.spyOn(mockGameService, 'update').mockResolvedValue(updatedGame);
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(updatedGame);

      const result = await gameController.update(mockGames[0], updateGameDto);
      expect(result).toEqual(updatedGame);
      expect(mockGameService.update).toHaveBeenCalledWith(mockGames[0].id, updateGameDto);
    });
  });

  describe('delete', () => {
    it('should delete a game successfully', async () => {
      await gameController.delete(mockGames[1]);
      expect(mockGameService.delete).toHaveBeenCalledWith(mockGames[1].id);
    });
  });
});
