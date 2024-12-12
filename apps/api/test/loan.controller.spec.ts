import { Game, Loan, Product, State, Role, LoanStatus } from "@playpal/schemas";
import { GameService } from "@/game/service/game.service";
import { LoanController } from "@/loan/controller/loan.controller";
import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { LoanService } from "@/loan/service/loan.service";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";
import { HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { create } from "domain";

describe('LoanController', () => {
  let loanController: LoanController;
  let mockLoanService: Partial<LoanService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameService: Partial<GameService>;
  let mockProductService: Partial<ProductService>;
  let mockGameRepository: Partial<Repository<Game>>;
  let mockProductRepository: Partial<Repository<Product>>;
  let mockLoanRepository: Partial<Repository<Loan>>;
  let mockEventEmitter: Partial<EventEmitter2>

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
    brand: "Magilano",
    rating: [],
    tags: [],
    rules: []
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
    createDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    product: mockProduct,
    user: mockUser,
    type: "oui",
    status: LoanStatus.WAITING
  };

  const mockLoans = [mockLoan];

  beforeEach(async () => {
    mockProductRepository = {
      findOne: jest.fn().mockResolvedValue(mockProduct),
    };

    mockLoanRepository = {
      findOne: jest.fn().mockResolvedValue(mockLoan),
    };

    mockLoanService = {
      getAllLoan: jest.fn().mockResolvedValue(mockLoans),
      getLoan: jest.fn().mockResolvedValue(mockLoan),
      create: jest.fn().mockResolvedValue(mockLoan),
      update: jest.fn().mockResolvedValue(mockLoan),
      delete: jest.fn().mockRejectedValue(undefined),
      getProductAvailable: jest.fn()
    };

    mockUserService = {
      getUserConnected: jest.fn().mockResolvedValue(mockUser),
    };

    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    mockGameService = {
      findOneGame: jest.fn().mockResolvedValue(mockGame),
      hasProductAvailable: jest.fn()
    };

    mockProductService = {
      getProduct: jest.fn().mockResolvedValue(mockProduct),
      assign: jest.fn().mockResolvedValue({...mockProduct, user: mockUser, available: false})
    };

    mockGameRepository = {
      findOne: jest.fn().mockResolvedValue(mockGame),
    };

    mockEventEmitter = {}

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        { provide: LoanService, useValue: mockLoanService },
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: GameService, useValue: mockGameService },
        { provide: ProductService, useValue: mockProductService },
        { provide: getRepositoryToken(Game), useValue: mockGameRepository },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
        { provide: getRepositoryToken(Loan), useValue: mockLoanRepository },
        { provide: EventEmitter2, useValue: mockEventEmitter }
      ],
    }).compile();

    loanController = module.get<LoanController>(LoanController);
  });

  describe('getAllLoan', () => {
    it('should return all loans for a valid gameId and productId', async () => {

      jest.spyOn(mockLoanService, 'getAllLoan').mockResolvedValue(mockLoans);

      const result = await loanController.getAllLoan();
      
      expect(result).toEqual(mockLoans);
    });
  });

  describe('getLoan', () => {
    it('should return a loan for valid ids', async () => {

      const result = loanController.getLoan(mockLoan);
      
      expect(result).toEqual(mockLoan);
    });
  });

  describe('createLoan', () => {
    it('should throw HttpException with 409 status if there is no products available for given game Id', async () => {
      const loanDto = {
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        gameId: mockGame.id,
        status: LoanStatus.WAITING
      
      };
  
      jest.spyOn(mockLoanService, 'getProductAvailable').mockResolvedValue(null);
  
      await expect(loanController.createLoan(mockUser, loanDto))
        .rejects.toThrow(HttpException);
  
      await expect(loanController.createLoan(mockUser, loanDto))
        .rejects.toMatchObject({
          status: HttpStatus.CONFLICT,
        });
  
      expect(mockLoanService.getProductAvailable).toHaveBeenCalledWith(mockGame.id);
      expect(mockLoanService.create).not.toHaveBeenCalled();
    });

    it('should create a loan for valid gameId', async () => {
      const loanDto = {startDate: new Date(), endDate: new Date(), gameId: mockGame.id, status: LoanStatus.WAITING };

      const createLoan: Loan = {
        ...mockLoan,
        endDate: loanDto.endDate,
        user: mockUser,
        createDate: new Date(),
      }

      jest.spyOn(mockLoanService, 'getProductAvailable').mockResolvedValue(mockProduct);
      jest.spyOn(mockLoanService, 'create').mockResolvedValue(createLoan);
      jest.spyOn(mockProductService, 'assign').mockResolvedValue({...mockProduct, user: mockUser, available: false});

      const result = await loanController.createLoan(mockUser, loanDto);
      expect(mockLoanService.create).toHaveBeenCalledWith(mockUser, mockProduct, loanDto.startDate, loanDto.endDate, loanDto.status);
      expect(result).toEqual(createLoan);
    });

    it('should throw HttpException with 500 status if loan creation fails', async () => {
      const loanDto = {startDate: new Date(), endDate: new Date(), gameId: mockGame.id };


      jest.spyOn(mockLoanService, 'create').mockResolvedValue(null);

      await expect(loanController.createLoan({...mockUser, id: '444e6543-e89b-12d3-a456-426614174000'}, loanDto))
        .rejects.toThrow(HttpException);
      await expect(loanController.createLoan({...mockUser, id: '444e6543-e89b-12d3-a456-426614174000'}, loanDto))
        .rejects.toMatchObject({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        });
    });
  });

  describe('updateLoan', () => {
    it('should update a loan for valid gameId, productId and loanId', async () => {
      const loanUpdatedDto = { startDate: new Date(), endDate: new Date() };

      jest.spyOn(mockLoanService, 'update').mockResolvedValue(undefined);
      jest.spyOn(mockLoanService, 'getLoan').mockResolvedValue(mockLoan);

      const result = await loanController.updateLoan(mockLoan, loanUpdatedDto);
      expect(result).toEqual(mockLoan);
      expect(mockLoanService.update).toHaveBeenCalledWith(validLoanId, loanUpdatedDto);
    });
  });

  describe('deleteLoan', () => {
    it('should delete a loan for valid gameId, productId and loanId', async () => {

      jest.spyOn(mockLoanService, 'delete').mockResolvedValue(undefined);

      await expect(loanController.deleteLoan(mockLoan))
        .resolves.toBeUndefined();
      expect(mockLoanService.delete).toHaveBeenCalledWith(validLoanId);
    });
  });
});
