import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from '@/rating/controller/rating.controller';
import { RatingService } from '@/rating/service/rating.service';
import { GameService } from '@/game/service/game.service';
import { UserService } from '@/user/service/user.service';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { Rating } from '@/rating/rating.entity';
import { Request } from 'express';
import { TranslationService } from '@/translation/translation.service';
import { User } from '@/user/user.entity';
import { Role } from '@/user/role.enum';
import { Game } from '@/game/game.entity';

describe('RatingController', () => {
  let ratingController: RatingController;
  let mockRatingService: Partial<RatingService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameService: Partial<GameService>;

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
      ],
    }).compile();

    ratingController = module.get<RatingController>(RatingController);
  });

  describe('getAllRating', () => {
    it('should return all ratings for a valid gameId', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getAllRating').mockResolvedValue([mockRating]);

      const result = await ratingController.getAllRating(mockRequest, validGameId);
      expect(result).toEqual([mockRating]);
      expect(mockRatingService.getAllRating).toHaveBeenCalledWith(validGameId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(ratingController.getAllRating(mockRequest, validGameId)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(ratingController.getAllRating(mockRequest, invalidId)).rejects.toThrow(HttpException);
      await expect(ratingController.getAllRating(mockRequest, invalidId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(ratingController.getAllRating(mockRequest, validGameId)).rejects.toThrow(HttpException);
      await expect(ratingController.getAllRating(mockRequest, validGameId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('getRating', () => {
    it('should return a rating for valid gameId and ratingId', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(mockRating);

      const result = await ratingController.getRating(mockRequest, validGameId, validRatingId);
      expect(result).toEqual(mockRating);
      expect(mockRatingService.getRating).toHaveBeenCalledWith(validGameId, validRatingId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(ratingController.getRating(mockRequest, validGameId, validRatingId)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or ratingId is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(ratingController.getRating(mockRequest, invalidId, validRatingId)).rejects.toThrow(HttpException);
      await expect(ratingController.getRating(mockRequest, invalidId, validRatingId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(ratingController.getRating(mockRequest, validGameId, invalidId)).rejects.toThrow(HttpException);
      await expect(ratingController.getRating(mockRequest, validGameId, invalidId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(ratingController.getRating(mockRequest, validGameId, validRatingId)).rejects.toThrow(HttpException);
      await expect(ratingController.getRating(mockRequest, validGameId, validRatingId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw HttpException with 404 status if rating not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(null);

      await expect(ratingController.getRating(mockRequest, validGameId, validRatingId)).rejects.toThrow(HttpException);
      await expect(ratingController.getRating(mockRequest, validGameId, validRatingId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('createRating', () => {
    it('should create a rating for a valid gameId', async () => {
      const mockRequest = {} as Request;
      const body = { note: 5, comment: 'Excellent game!' };
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'create').mockResolvedValue(mockRating);

      const result = await ratingController.createRating(mockRequest, validGameId, body);
      expect(result).toEqual(mockRating);
      expect(mockRatingService.create).toHaveBeenCalledWith(validGameId, mockUser.id, body);
    });

    it('should throw HttpException with 400 status if gameId is invalid', async () => {
      const mockRequest = {} as Request;
      const body = { note: 4, comment: 'Good game!' };

      await expect(ratingController.createRating(mockRequest, invalidId, body)).rejects.toThrow(HttpException);
      await expect(ratingController.createRating(mockRequest, invalidId, body)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      const body = { note: 5, comment: 'Amazing game!' };
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(ratingController.createRating(mockRequest, validGameId, body)).rejects.toThrow(HttpException);
      await expect(ratingController.createRating(mockRequest, validGameId, body)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw HttpException with 500 status if rating cannot be created', async () => {
      const mockRequest = {} as Request;
      const body = { note: 5, comment: 'Incredible!' };
      jest.spyOn(mockRatingService, 'create').mockResolvedValue(null);

      await expect(ratingController.createRating(mockRequest, validGameId, body)).rejects.toThrow(HttpException);
      await expect(ratingController.createRating(mockRequest, validGameId, body)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('updateRating', () => {
    it('should update a rating for valid gameId and ratingId', async () => {
      const mockRequest = {} as Request;
      const body = { note: 4, comment: 'Updated comment!' };
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'update').mockResolvedValue(undefined);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(mockRating);

      const result = await ratingController.updateRating(mockRequest, validGameId, validRatingId, body);
      expect(result).toEqual(mockRating);
      expect(mockRatingService.update).toHaveBeenCalledWith(validRatingId, body);
      expect(mockRatingService.getRating).toHaveBeenCalledWith(validGameId, mockUser.id);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      const body = { note: 4, comment: 'Updated comment!' };
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(ratingController.updateRating(mockRequest, validGameId, validRatingId, body))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or ratingId is invalid', async () => {
      const mockRequest = {} as Request;
      const body = { note: 4, comment: 'Updated comment!' };

      await expect(ratingController.updateRating(mockRequest, invalidId, validRatingId, body))
        .rejects.toThrow(HttpException);
      await expect(ratingController.updateRating(mockRequest, invalidId, validRatingId, body))
        .rejects.toMatchObject({
          status: HttpStatus.BAD_REQUEST,
        });

      await expect(ratingController.updateRating(mockRequest, validGameId, invalidId, body))
        .rejects.toThrow(HttpException);
      await expect(ratingController.updateRating(mockRequest, validGameId, invalidId, body))
        .rejects.toMatchObject({
          status: HttpStatus.BAD_REQUEST,
        });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      const body = { note: 4, comment: 'Updated comment!' };
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(ratingController.updateRating(mockRequest, validGameId, validRatingId, body))
        .rejects.toThrow(HttpException);
      await expect(ratingController.updateRating(mockRequest, validGameId, validRatingId, body))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });

    it('should throw HttpException with 404 status if rating not found', async () => {
      const mockRequest = {} as Request;
      const body = { note: 4, comment: 'Updated comment!' };
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(null);

      await expect(ratingController.updateRating(mockRequest, validGameId, validRatingId, body))
        .rejects.toThrow(HttpException);
      await expect(ratingController.updateRating(mockRequest, validGameId, validRatingId, body))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating for valid gameId and ratingId', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'delete').mockResolvedValue(undefined);

      await expect(ratingController.deleteRating(mockRequest, validGameId, validRatingId))
        .resolves.toBeUndefined();
      expect(mockRatingService.delete).toHaveBeenCalledWith(validGameId, validRatingId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(ratingController.deleteRating(mockRequest, validGameId, validRatingId))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or ratingId is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(ratingController.deleteRating(mockRequest, invalidId, validRatingId))
        .rejects.toThrow(HttpException);
      await expect(ratingController.deleteRating(mockRequest, invalidId, validRatingId))
        .rejects.toMatchObject({
          status: HttpStatus.BAD_REQUEST,
        });

      await expect(ratingController.deleteRating(mockRequest, validGameId, invalidId))
        .rejects.toThrow(HttpException);
      await expect(ratingController.deleteRating(mockRequest, validGameId, invalidId))
        .rejects.toMatchObject({
          status: HttpStatus.BAD_REQUEST,
        });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(ratingController.deleteRating(mockRequest, validGameId, validRatingId))
        .rejects.toThrow(HttpException);
      await expect(ratingController.deleteRating(mockRequest, validGameId, validRatingId))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });
  });
});
