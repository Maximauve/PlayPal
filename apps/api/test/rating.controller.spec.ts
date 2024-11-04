import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from '@/rating/controller/rating.controller';
import { RatingService } from '@/rating/service/rating.service';
import { GameService } from '@/game/service/game.service';
import { UserService } from '@/user/service/user.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Rating } from '@/rating/rating.entity';
import { TranslationService } from '@/translation/translation.service';
import { User } from '@/user/user.entity';
import { Role } from '@/user/role.enum';
import { Game } from '@/game/game.entity';
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

  const mockGame: Game = {
    id: "568931ed-d87e-4bf1-b477-2f1aea83e3da",
    name: "6-qui-prends",
    description: "Un jeu de taureaux",
    minPlayers: 3,
    maxPlayers: 8,
    duration: "45",
    difficulty: 3,
    minYear: 10,
    rating: []
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

      const result = await ratingController.getAllRating(validGameId);
      expect(result).toEqual([mockRating]);
      expect(mockRatingService.getAllRating).toHaveBeenCalledWith(validGameId);
    });
  });

  describe('getRating', () => {
    it('should return a rating for valid gameId and ratingId', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(mockRating);

      const result = await ratingController.getRating(validGameId, validRatingId);
      expect(result).toEqual(mockRating);
      expect(mockRatingService.getRating).toHaveBeenCalledWith(validGameId, validRatingId);
    });
  });

  describe('createRating', () => {
    it('should create a rating for a valid gameId', async () => {
      const body = { note: 5, comment: 'Excellent game!' };
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'create').mockResolvedValue(mockRating);

      const result = await ratingController.createRating(mockUser, validGameId, body);
      expect(result).toEqual(mockRating);
      expect(mockRatingService.create).toHaveBeenCalledWith(validGameId, mockUser.id, body);
    });

    it('should throw HttpException with 500 status if rating cannot be created', async () => {
      const body = { note: 5, comment: 'Incredible!' };
      jest.spyOn(mockRatingService, 'create').mockResolvedValue(null);

      await expect(ratingController.createRating(mockUser, validGameId, body)).rejects.toThrow(HttpException);
      await expect(ratingController.createRating(mockUser, validGameId, body)).rejects.toMatchObject({
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

      const result = await ratingController.updateRating(mockUser, validGameId, validRatingId, body);
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

      await expect(ratingController.deleteRating(validGameId, validRatingId))
        .resolves.toBeUndefined();
      expect(mockRatingService.delete).toHaveBeenCalledWith(validGameId, validRatingId);
    });
  });
});