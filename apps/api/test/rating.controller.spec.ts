import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from '@/rating/controller/rating.controller';
import { RatingService } from '@/rating/service/rating.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { GameService } from '@/game/service/game.service';
import { RatingDto } from '@/rating/dto/rating.dto';
import { RatingUpdatedDto } from '@/rating/dto/ratingUpdated.dto';
import { Rating } from '@/rating/rating.entity';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@/user/role.enum';
import { Game } from '@/game/game.entity';

describe('RatingController', () => {
  let ratingController: RatingController;
  let mockRatingService: Partial<RatingService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameService: Partial<GameService>;

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
        rating: []
      },
      note: 4,
      comment: 'Great game!',
      creationDate: new Date()
    },
  ];

  const mockGame: Game = {
    id: "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c",
    name: "Skyjo",
    description: "Un bon jeu",
    maxPlayers: 5,
    minPlayers: 2,
    minYear: 3,
    difficulty: 3,
    duration: "35min",
    rating: []
  }

  beforeEach(async () => {
    mockRatingService = {
      getAllRating: jest.fn().mockResolvedValue(mockRatings),
      getRating: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockUserService = {
      getUserConnected: jest.fn().mockResolvedValue({ id: "u2345678-1234-5678-9abc-123456789abc" }),
    };

    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    mockGameService = {
      findOneGame: jest.fn(),
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
    it('should return all ratings for a game', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);

      const result = await ratingController.getAllRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c");
      expect(result).toEqual(mockRatings);
      expect(mockRatingService.getAllRating).toHaveBeenCalledWith("6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c");
    });

    it('should throw a 404 error if game not found', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(ratingController.getAllRating(mockRequest, "dfc68e6e-3025-4fef-946a-9ac1385234fa")).rejects.toThrow(HttpException);
      await expect(ratingController.getAllRating(mockRequest, "dfc68e6e-3025-4fef-946a-9ac1385234fa")).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('getRating', () => {
    it('should return a specific rating by ID', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(mockRatings[0]);

      const result = await ratingController.getRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "a2345678-1234-5678-9abc-123456789abc");
      expect(result).toEqual(mockRatings[0]);
    });

    it('should throw a 404 error if rating not found', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(null);

      await expect(ratingController.getRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "cacd3df4-2d89-4bcb-9b21-d7c86c93a6b2")).rejects.toThrow(HttpException);
      await expect(ratingController.getRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "cacd3df4-2d89-4bcb-9b21-d7c86c93a6b2")).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('createRating', () => {
    it('should create a new rating for a game', async () => {
      const mockRequest = {} as Request;
      const ratingDto: RatingDto = { note: 5, comment: 'Amazing!' };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'create').mockResolvedValue(mockRatings[0]);

      const result = await ratingController.createRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", ratingDto);
      expect(result).toEqual(mockRatings[0]);
      expect(mockRatingService.create).toHaveBeenCalledWith("6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "u2345678-1234-5678-9abc-123456789abc", ratingDto);
    });

    it('should throw a 404 error if game not found', async () => {
      const mockRequest = {} as Request;
      const ratingDto: RatingDto = { note: 5, comment: 'Amazing!' };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(ratingController.createRating(mockRequest, "dfc68e6e-3025-4fef-946a-9ac1385234fa", ratingDto)).rejects.toThrow(HttpException);
      await expect(ratingController.createRating(mockRequest, "dfc68e6e-3025-4fef-946a-9ac1385234fa", ratingDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('updateRating', () => {
    it('should update a rating for a game', async () => {
      const mockRequest = {} as Request;
      const updatedRatingDto: RatingUpdatedDto = { note: 4, comment: 'Updated comment' };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(mockRatings[0]);
      jest.spyOn(mockRatingService, 'update').mockResolvedValue(undefined);

      const result = await ratingController.updateRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "a2345678-1234-5678-9abc-123456789abc", updatedRatingDto);
      expect(result).toEqual(mockRatings[0]);
    });

    it('should throw a 404 error if rating not found', async () => {
      const mockRequest = {} as Request;
      const updatedRatingDto: RatingUpdatedDto = { note: 4, comment: 'Updated comment' };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'getRating').mockResolvedValue(null);

      await expect(ratingController.updateRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "cacd3df4-2d89-4bcb-9b21-d7c86c93a6b2", updatedRatingDto)).rejects.toThrow(HttpException);
      await expect(ratingController.updateRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "cacd3df4-2d89-4bcb-9b21-d7c86c93a6b2", updatedRatingDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('deleteRating', () => {
    it('should delete a rating', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'delete').mockResolvedValue(undefined);

      await ratingController.deleteRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "a2345678-1234-5678-9abc-123456789abc");
      expect(mockRatingService.delete).toHaveBeenCalledWith("6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "a2345678-1234-5678-9abc-123456789abc");
    });

    it('should throw a 404 error if rating not found', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockRatingService, 'delete').mockImplementation(() => {
        throw new HttpException('Rating not found', HttpStatus.NOT_FOUND);
      });

      await expect(ratingController.deleteRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "cacd3df4-2d89-4bcb-9b21-d7c86c93a6b2")).rejects.toThrow(HttpException);
      await expect(ratingController.deleteRating(mockRequest, "6bd7ba90-d2d6-4f81-9f09-7d1f23346a1c", "cacd3df4-2d89-4bcb-9b21-d7c86c93a6b2")).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });
});
