import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from '@/game/controller/game.controller';
import { GameService } from '@/game/service/game.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { Game } from '@/game/game.entity';
import { GameDto } from '@/game/dto/game.dto';
import { GameUpdatedDto } from '@/game/dto/gameUpdated.dto';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Role } from '@/user/role.enum';

describe('GameController', () => {
  let gameController: GameController;
  let mockGameService: Partial<GameService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;

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
      rating: []
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
      rating: []
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
      ],
    }).compile();

    gameController = module.get<GameController>(GameController);
  });

  describe('getAll', () => {
    it('should return all games', async () => {
      const result = await gameController.getAll();
      expect(result).toEqual(mockGames);
      expect(mockGameService.getAll).toHaveBeenCalled();
    });
  });

  describe('getOneGame', () => {
    const mockRequest = {} as any;

    it('should return a specific game by ID', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGames[0]);

      const result = await gameController.getOneGame(mockRequest, "568931ed-d87e-4bf1-b477-2f1aea83e3da");
      expect(result).toEqual(mockGames[0]);
      expect(mockGameService.findOneGame).toHaveBeenCalledWith("568931ed-d87e-4bf1-b477-2f1aea83e3da");
    });

    it('should throw unauthorized exception if user not connected', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(gameController.getOneGame(mockRequest, "568931ed-d87e-4bf1-b477-2f1aea83e3da"))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw exception if game not found', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(gameController.getOneGame(mockRequest, 'fd5446b4-8e89-4cd4-8c01-46e9f8cc975b'))
        .rejects.toThrow(HttpException);
      await expect(gameController.getOneGame(mockRequest, 'fd5446b4-8e89-4cd4-8c01-46e9f8cc975b'))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });
  });

  describe('create', () => {
    const mockRequest = {} as any;
    const createGameDto: GameDto = {
      name: "Jeu",
      description: "Un jeu amusant",
      minPlayers: 2,
      maxPlayers: 4,
      duration: "35min",
      difficulty: 2,
      minYear: 10
    };

    it('should create a new game successfully', async () => {
      jest.spyOn(mockGameService, 'create').mockResolvedValue(mockGames[0]);

      const result = await gameController.create(mockRequest, createGameDto);
      expect(result).toEqual(mockGames[0]);
      expect(mockGameService.create).toHaveBeenCalledWith(createGameDto);
    });

    it('should throw unauthorized exception if user not connected', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(gameController.create(mockRequest, createGameDto))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw exception if game creation fails', async () => {
      jest.spyOn(mockGameService, 'create').mockResolvedValue(null);

      await expect(gameController.create(mockRequest, createGameDto))
        .rejects.toThrow(HttpException);
      await expect(gameController.create(mockRequest, createGameDto))
        .rejects.toMatchObject({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    });
  });

  describe('update', () => {
    const mockRequest = {} as any;
    const updateGameDto: GameUpdatedDto = {
      description: "Description updated",
      minYear: 12
    };

    it('should update a game successfully', async () => {
      const updatedGame = { ...mockGames[0], ...updateGameDto };
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(updatedGame);

      const result = await gameController.update(mockRequest, "568931ed-d87e-4bf1-b477-2f1aea83e3da", updateGameDto);
      expect(result).toEqual(updatedGame);
      expect(mockGameService.update).toHaveBeenCalledWith("568931ed-d87e-4bf1-b477-2f1aea83e3da", updateGameDto);
    });

    it('should throw unauthorized exception if user not connected', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(gameController.update(mockRequest, "568931ed-d87e-4bf1-b477-2f1aea83e3da", updateGameDto))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw exception if game not found after update', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(gameController.update(mockRequest, "568931ed-d87e-4bf1-b477-2f1aea83e3da", updateGameDto))
        .rejects.toThrow(HttpException);
      await expect(gameController.update(mockRequest, "568931ed-d87e-4bf1-b477-2f1aea83e3da", updateGameDto))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });
  });

  describe('delete', () => {
    const mockRequest = {} as any;

    it('should delete a game successfully', async () => {
      await gameController.delete(mockRequest, "568931ed-d87e-4bf1-b477-2f1aea83e3da");
      expect(mockGameService.delete).toHaveBeenCalledWith("568931ed-d87e-4bf1-b477-2f1aea83e3da");
    });

    it('should throw unauthorized exception if user not connected', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(gameController.delete(mockRequest, "568931ed-d87e-4bf1-b477-2f1aea83e3da"))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});