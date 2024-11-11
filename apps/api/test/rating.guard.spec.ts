import { Test, TestingModule } from '@nestjs/testing';
import { RatingGuard } from '@/rating/guards/rating.guard';
import { TranslationService } from '@/translation/translation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rating } from '@/rating/rating.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '@/user/role.enum';

describe('RatingGuard', () => {
  let ratingGuard: RatingGuard;
  let mockTranslationService: Partial<TranslationService>;
  let mockRatingRepository: jest.Mocked<Repository<Rating>>;

  const validRatingId = "111e7890-e89b-12d3-a456-426614174000";
  const invalidRatingId = "invalid-id";
  const validGameId = "222e4567-e89b-12d3-a456-426614174000";
  const invalidGameId = "invalid-game-id";
  const mockRating: Rating = {
    id: validRatingId,
    game: {
      id: validGameId,
      name: 'Skyjo',
      description: "oui",
      minPlayers: 3,
      maxPlayers: 5,
      minYear: 3,
      difficulty: 3,
      duration: "35min"
    },
    note: 4,
    comment: "Trop cool",
    creationDate: new Date(),
    user: {
      id: "987e6543-e89b-12d3-a456-426614174002",
      username: "John Doe",
      email: "john@doe.fr",
      password: "johnpassword",
      role: Role.Customer,
      creationDate: new Date()
    }
  };

  beforeEach(async () => {
    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    mockRatingRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingGuard,
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: getRepositoryToken(Rating), useValue: mockRatingRepository },
      ],
    }).compile();

    ratingGuard = module.get<RatingGuard>(RatingGuard);
  });

  it('should throw HttpException with 400 status if ratingId or gameId is invalid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { ratingId: invalidRatingId, gameId: invalidGameId },
        }),
      }),
    } as ExecutionContext;

    await expect(ratingGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(ratingGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should throw HttpException with 404 status if rating is not found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { ratingId: validRatingId, gameId: validGameId },
        }),
      }),
    } as ExecutionContext;

    mockRatingRepository.findOne.mockResolvedValue(null);

    await expect(ratingGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(ratingGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
    });
  });

  it('should allow the request if rating is found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { ratingId: validRatingId, gameId: validGameId },
        }),
      }),
    } as ExecutionContext;

    mockRatingRepository.findOne.mockResolvedValue(mockRating);

    const result = await ratingGuard.canActivate(context);
    expect(result).toBe(true);
  });
});
