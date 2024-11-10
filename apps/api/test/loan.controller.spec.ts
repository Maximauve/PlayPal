import { GameService } from "@/game/service/game.service";
import { LoanController } from "@/loan/controller/loan.controller";
import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { LoanService } from "@/loan/service/loan.service";
import { ProductService } from "@/product/service/product.service";
import { State } from "@/product/state.enum";
import { TranslationService } from "@/translation/translation.service";
import { Role } from "@/user/role.enum";
import { UserService } from "@/user/service/user.service";
import { HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Request } from "express";

describe('LoanController', () => {
  let loanController: LoanController;
  let mockLoanService: Partial<LoanService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameService: Partial<GameService>;
  let mockProductService: Partial<ProductService>;

  const validGameId = "111e7890-e89b-12d3-a456-426614174000";
  const validProductId = "222e4567-e89b-12d3-a456-426614174000";
  const validLoanId = "333e4567-e89b-12d3-a456-426614174000";
  const invalidId = "invalid-id";

  const mockUser = {
    id: "444e6543-e89b-12d3-a456-426614174000",
    username: "John Doe",
    email: "john@doe.fr",
    password: "password123",
    role: Role.Customer,
    creationDate: new Date()
  };

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

  const mockProduct = {
    id: validProductId,
    state: State.GOOD,
    available: true,
    user: null,
    game: mockGame,
    loan: []
  };

  const mockLoan = {
    id: validLoanId,
    startDate: new Date(),
    endDate: new Date(),
    product: mockProduct,
    user: mockUser,
    type: "oui"
  };

  const mockLoans = [mockLoan];

  beforeEach(async () => {
    mockLoanService = {
      getAllLoan: jest.fn().mockResolvedValue(mockLoans),
      getLoan: jest.fn().mockResolvedValue(mockLoan),
      create: jest.fn().mockResolvedValue(mockLoan),
      update: jest.fn().mockResolvedValue(mockLoan),
      delete: jest.fn().mockRejectedValue(undefined)
    };

    mockUserService = {
      getUserConnected: jest.fn().mockResolvedValue(mockUser),
    };

    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    mockGameService = {
      findOneGame: jest.fn().mockResolvedValue(mockGame),
    };

    mockProductService = {
      getProduct: jest.fn().mockResolvedValue(mockProduct),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        { provide: LoanService, useValue: mockLoanService },
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: GameService, useValue: mockGameService },
        { provide: ProductService, useValue: mockProductService },
      ],
    }).compile();

    loanController = module.get<LoanController>(LoanController);
  });

  describe('getAllLoan', () => {
    it('should return all loans for a valid gameId and productId', async () => {
      const mockRequest = {} as Request;

      const result = await loanController.getAllLoan(mockRequest, validGameId, validProductId);
      
      expect(result).toEqual(mockLoans);
      expect(mockLoanService.getAllLoan).toHaveBeenCalledWith(validProductId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(loanController.getAllLoan(mockRequest, validGameId, validProductId))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or productId is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(loanController.getAllLoan(mockRequest, invalidId, validProductId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getAllLoan(mockRequest, invalidId, validProductId))
        .rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST });

      await expect(loanController.getAllLoan(mockRequest, validGameId, invalidId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getAllLoan(mockRequest, validGameId, invalidId))
        .rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(loanController.getAllLoan(mockRequest, validGameId, validProductId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getAllLoan(mockRequest, validGameId, validProductId))
        .rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should throw HttpException with 404 status if product not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(null);

      await expect(loanController.getAllLoan(mockRequest, validGameId, validProductId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getAllLoan(mockRequest, validGameId, validProductId))
        .rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });
  });

  describe('getLoan', () => {
    it('should return a loan for valid ids', async () => {
      const mockRequest = {} as Request;

      const result = await loanController.getLoan(mockRequest, validGameId, validProductId, validLoanId);
      
      expect(result).toEqual(mockLoan);
      expect(mockLoanService.getLoan).toHaveBeenCalledWith(validProductId, validLoanId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if any id is invalid', async () => {
      const mockRequest = {} as Request;

      // Test invalid gameId
      await expect(loanController.getLoan(mockRequest, invalidId, validProductId, validLoanId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getLoan(mockRequest, invalidId, validProductId, validLoanId))
        .rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST });

      // Test invalid productId
      await expect(loanController.getLoan(mockRequest, validGameId, invalidId, validLoanId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getLoan(mockRequest, validGameId, invalidId, validLoanId))
        .rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST });

      // Test invalid loanId
      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, invalidId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, invalidId))
        .rejects.toMatchObject({ status: HttpStatus.BAD_REQUEST });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should throw HttpException with 404 status if product not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(null);

      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should throw HttpException with 404 status if loan not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockLoanService, 'getLoan').mockResolvedValue(null);

      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toThrow(HttpException);
      await expect(loanController.getLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });
  });

  describe('createLoan', () => {
    it('should create a loan for valid gameId and productId', async () => {
      const mockRequest = {} as Request;
      const loanDto = { endDate: new Date(), type: "non", userId: "444e6543-e89b-12d3-a456-426614174000" };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(mockProduct);
      jest.spyOn(mockLoanService, 'create').mockResolvedValue(mockLoan);

      const result = await loanController.createLoan(mockRequest, validGameId, validProductId, loanDto);
      expect(result).toEqual(mockLoan);
      expect(mockLoanService.create).toHaveBeenCalledWith(validProductId, mockUser.id, loanDto);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(loanController.createLoan(mockRequest, validGameId, validProductId, {} as LoanDto))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or productId is invalid', async () => {
      const mockRequest = {} as Request;
      const loanDto = { endDate: new Date(), userId: "444e6543-e89b-12d3-a456-426614174000", type: "peut-être" };

      await expect(loanController.createLoan(mockRequest, invalidId, validProductId, loanDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.createLoan(mockRequest, invalidId, validProductId, loanDto))
        .rejects.toMatchObject({
          status: HttpStatus.BAD_REQUEST,
        });

      await expect(loanController.createLoan(mockRequest, validGameId, invalidId, loanDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.createLoan(mockRequest, validGameId, invalidId, loanDto))
        .rejects.toMatchObject({
          status: HttpStatus.BAD_REQUEST,
        });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      const loanDto = { endDate: new Date(), userId: "444e6543-e89b-12d3-a456-426614174000", type: "oui" };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(loanController.createLoan(mockRequest, validGameId, validProductId, loanDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.createLoan(mockRequest, validGameId, validProductId, loanDto))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });

    it('should throw HttpException with 404 status if product not found', async () => {
      const mockRequest = {} as Request;
      const loanDto = { endDate: new Date(), userId: "444e6543-e89b-12d3-a456-426614174000", type: "oui" };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(null);

      await expect(loanController.createLoan(mockRequest, validGameId, validProductId, loanDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.createLoan(mockRequest, validGameId, validProductId, loanDto))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });

    it('should throw HttpException with 500 status if loan creation fails', async () => {
      const mockRequest = {} as Request;
      const loanDto = { endDate: new Date(), userId: "444e6543-e89b-12d3-a456-426614174000", type: "oui" };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(mockProduct);
      jest.spyOn(mockLoanService, 'create').mockResolvedValue(null);

      await expect(loanController.createLoan(mockRequest, validGameId, validProductId, loanDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.createLoan(mockRequest, validGameId, validProductId, loanDto))
        .rejects.toMatchObject({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    });
  });

  describe('updateLoan', () => {
    it('should update a loan for valid gameId, productId and loanId', async () => {
      const mockRequest = {} as Request;
      const loanUpdatedDto = { startDate: new Date(), endDate: new Date() };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(mockProduct);
      jest.spyOn(mockLoanService, 'update').mockResolvedValue(undefined);
      jest.spyOn(mockLoanService, 'getLoan').mockResolvedValue(mockLoan);

      const result = await loanController.updateLoan(mockRequest, validGameId, validProductId, validLoanId, loanUpdatedDto);
      expect(result).toEqual(mockLoan);
      expect(mockLoanService.update).toHaveBeenCalledWith(validLoanId, loanUpdatedDto);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(loanController.updateLoan(mockRequest, validGameId, validProductId, validLoanId, {} as LoanUpdatedDto))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if any ID is invalid', async () => {
      const mockRequest = {} as Request;
      const loanUpdatedDto = { startDate: new Date(), endDate: new Date() };

      await expect(loanController.updateLoan(mockRequest, invalidId, validProductId, validLoanId, loanUpdatedDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.updateLoan(mockRequest, validGameId, invalidId, validLoanId, loanUpdatedDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.updateLoan(mockRequest, validGameId, validProductId, invalidId, loanUpdatedDto))
        .rejects.toThrow(HttpException);
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      const loanUpdatedDto = { startDate: new Date(), endDate: new Date() };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(loanController.updateLoan(mockRequest, validGameId, validProductId, validLoanId, loanUpdatedDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.updateLoan(mockRequest, validGameId, validProductId, validLoanId, loanUpdatedDto))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });

    it('should throw HttpException with 404 status if product not found', async () => {
      const mockRequest = {} as Request;
      const loanUpdatedDto = { startDate: new Date(), endDate: new Date() };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(null);

      await expect(loanController.updateLoan(mockRequest, validGameId, validProductId, validLoanId, loanUpdatedDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.updateLoan(mockRequest, validGameId, validProductId, validLoanId, loanUpdatedDto))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });

    it('should throw HttpException with 404 status if loan not found after update', async () => {
      const mockRequest = {} as Request;
      const loanUpdatedDto = { startDate: new Date(), endDate: new Date() };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(mockProduct);
      jest.spyOn(mockLoanService, 'update').mockResolvedValue(undefined);
      jest.spyOn(mockLoanService, 'getLoan').mockResolvedValue(null);

      await expect(loanController.updateLoan(mockRequest, validGameId, validProductId, validLoanId, loanUpdatedDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.updateLoan(mockRequest, validGameId, validProductId, validLoanId, loanUpdatedDto))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });
  });

  describe('deleteLoan', () => {
    it('should delete a loan for valid gameId, productId and loanId', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(mockProduct);
      jest.spyOn(mockLoanService, 'delete').mockResolvedValue(undefined);

      await expect(loanController.deleteLoan(mockRequest, validGameId, validProductId, validLoanId))
        .resolves.toBeUndefined();
      expect(mockLoanService.delete).toHaveBeenCalledWith(validProductId, validLoanId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(loanController.deleteLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if any ID is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(loanController.deleteLoan(mockRequest, invalidId, validProductId, validLoanId))
        .rejects.toThrow(HttpException);
      await expect(loanController.deleteLoan(mockRequest, validGameId, invalidId, validLoanId))
        .rejects.toThrow(HttpException);
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(loanController.deleteLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toThrow(HttpException);
      await expect(loanController.deleteLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });

    it('should throw HttpException with 404 status if product not found', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(null);

      await expect(loanController.deleteLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toThrow(HttpException);
      await expect(loanController.deleteLoan(mockRequest, validGameId, validProductId, validLoanId))
        .rejects.toMatchObject({
          status: HttpStatus.NOT_FOUND,
        });
    });
  });
});