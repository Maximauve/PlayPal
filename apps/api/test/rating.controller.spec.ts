import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from '@/rating/controller/rating.controller';
import { RatingService } from '@/rating/service/rating.service';
import { GameService } from '@/game/service/game.service';
import { UserService } from '@/user/service/user.service';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { TranslationService } from '@/translation/translation.service';
import { User, Rating, Role, Game } from '@playpal/schemas';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('RatingController', () => {
  let ratingController: RatingController;
  let mockRatingService: Partial<RatingService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameService: Partial<GameService>;
  let mockGameRepository: Partial<Repository<Game>>;
  let mockRatingRepository: Partial<Repository<Rating>>;

  const validGameId = '123e4567-e89b-12d3-a456-426614174000';
  const invalidId = 'invalid-id';
  const validRatingId = '987e4567-e89b-12d3-a456-426614174000';

  const mockUser: User = { 
    id: "987e6543-e89b-12d3-a456-426614174002",
    username: "John Doe",
    email: "john@doe.fr",
    password: "johnpassword",
    role: Role.Customer,
    creationDate: new Date()
  };
  
  const mockRatings: Rating[] = [
    {
      id: "a2345678-1234-5678-9abc-123456789abc",
      user: {
        id: "48eab136-49bc-4fd8-bcb7-3338a3cfb729",
        username: "John Doe",
        password: "password",
        email: "john.doe@email.com",
        creationDate: new Date(),
        role: Role.Customer,
        rating: []
      },
      game: {
        id: "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c",
        name: "Skyjo",
        description: "Un bon jeu",
        maxPlayers: 5,
        minPlayers: 2,
        minYear: 3,
        difficulty: 3,
        duration: "35min",
        brand: "Magilano",
        rating: [],
        tags: [],
        rules: []
      },
      note: 4,
      comment: 'Great game!',
      creationDate: new Date()
    },
  ];

  const mockGame: Game = {
    id: validGameId,
    name: "6-qui-prends",
    description: "Un jeu de taureaux",
    minPlayers: 3,
    maxPlayers: 8,
    duration: "45",
    difficulty: 3,
    brand: "Gigamic",
    minYear: 10,
    rating: [],
    tags: [],
    rules: []
  }

  const mockRating: Rating = { 
    id: validRatingId, 
    game: mockGame, 
    note: 5, 
    comment: 'Great game!',
    user: mockUser,
    creationDate: new Date()
  };

  beforeEach(async () => {
    mockGameRepository = {};
    mockRatingRepository = {};

    mockRatingService = {
      getAllRating: jest.fn().mockResolvedValue([mockRating]),
      getRating: jest.fn().mockResolvedValue(mockRating),
      create: jest.fn().mockResolvedValue(mockRating),
      update: jest.fn().mockResolvedValue(mockRating),
      delete: jest.fn().mockResolvedValue(null),
    };

    mockUserService = {
      getUserConnected: jest.fn().mockResolvedValue(mockUser),
      findOneUser: jest.fn().mockResolvedValue(mockUser),
    };

    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    mockGameService = {
      findOneGame: jest.fn().mockResolvedValue(mockRating.game),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [
        { provide: RatingService, useValue: mockRatingService },
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: GameService, useValue: mockGameService },
        { provide: getRepositoryToken(Game), useValue: mockGameRepository },
        { provide: getRepositoryToken(Rating), useValue: mockRatingRepository },
      ],
    }).compile();

    ratingController = module.get<RatingController>(RatingController);
  });

  describe('getAllRating', () => {
    it('should return all ratings for a valid gameId', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getAllRating').mockResolvedValue([mockRating]);

      const result = await ratingController.getAllRating(mockGame);
      expect(result).toEqual([mockRating]);
    });
  });

  describe('getRating', () => {
    it('should return a rating for valid gameId and ratingId', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(mockRating);

      const result = await ratingController.getRating(mockRating);
      expect(result).toEqual(mockRating);
    });
  });

  describe('createRating', () => {
    it('should create a rating for a valid gameId', async () => {
      const body = { note: 5, comment: 'Excellent game!' };
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'create').mockResolvedValue(mockRating);

      const result = await ratingController.createRating(mockUser, mockGame, body);
      expect(result).toEqual(mockRating);
      expect(mockRatingService.create).toHaveBeenCalledWith(validGameId, mockUser.id, body);
    });

    it('should throw HttpException with 500 status if rating cannot be created', async () => {
      const body = { note: 5, comment: 'Incredible!' };
      jest.spyOn(mockRatingService, 'create').mockResolvedValue(null);

      await expect(ratingController.createRating(mockUser, mockGame, body)).rejects.toThrow(HttpException);
      await expect(ratingController.createRating(mockUser, mockGame, body)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('updateRating', () => {
    it('should update a rating for valid gameId and ratingId', async () => {
      const body = { note: 4, comment: 'Updated comment!' };
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'update').mockResolvedValue(undefined);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(mockRating);

      const result = await ratingController.updateRating(mockUser, mockGame, mockRating, body);
      expect(result).toEqual(mockRating);
      expect(mockRatingService.update).toHaveBeenCalledWith(validRatingId, body);
      expect(mockRatingService.getRating).toHaveBeenCalledWith(validGameId, mockUser.id);
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating for valid gameId and ratingId', async () => {
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'delete').mockResolvedValue(undefined);

      await expect(ratingController.deleteRating(mockGame, mockRating))
        .resolves.toBeUndefined();
      expect(mockRatingService.delete).toHaveBeenCalledWith(validGameId, validRatingId);
    });
  });
});
