import { Test, TestingModule } from '@nestjs/testing';
import { GameGuard } from '@/game/guards/game.guard';  // Remplacez par le bon chemin
import { TranslationService } from '@/translation/translation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '@/game/game.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

describe('GameGuard', () => {
  let gameGuard: GameGuard;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameRepository: jest.Mocked<Repository<Game>>;

  const validGameId = "111e7890-e89b-12d3-a456-426614174000";
  const invalidGameId = "invalid-id";
  const mockGame = {
    id: validGameId,
    name: "Skyjo",
    description: "Un bon jeu",
    maxPlayers: 5,
    minPlayers: 2,
    minYear: 3,
    difficulty: 3,
    duration: "35min",
    rating: []
  };

  beforeEach(async () => {
    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),  // Mock translation
    };

    mockGameRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameGuard,
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: getRepositoryToken(Game), useValue: mockGameRepository },
      ],
    }).compile();

    gameGuard = module.get<GameGuard>(GameGuard);
  });

  it('should throw HttpException with 400 status if gameId is invalid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { gameId: invalidGameId },
        }),
      }),
    } as ExecutionContext;

    await expect(gameGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(gameGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should throw HttpException with 404 status if game is not found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { gameId: validGameId },
        }),
      }),
    } as ExecutionContext;

    mockGameRepository.findOne.mockResolvedValue(null);

    await expect(gameGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(gameGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
    });
  });

  it('should allow the request if game is found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { gameId: validGameId },
        }),
      }),
    } as ExecutionContext;

    // Simule que le jeu est trouvé
    mockGameRepository.findOne.mockResolvedValue(mockGame);

    const result = await gameGuard.canActivate(context);
    expect(result).toBe(true);
  });
});
