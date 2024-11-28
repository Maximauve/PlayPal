import { Test, TestingModule } from '@nestjs/testing';
import { LoanGuard } from '@/loan/guards/loan.guard';
import { TranslationService } from '@/translation/translation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Loan, State, Role } from '@playpal/schemas';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

describe('LoanGuard', () => {
  let loanGuard: LoanGuard;
  let mockTranslationService: Partial<TranslationService>;
  let mockLoanRepository: jest.Mocked<Repository<Loan>>;

  const validLoanId = "111e7890-e89b-12d3-a456-426614174000";
  const invalidLoanId = "invalid-id";
  const validProductId = "222e4567-e89b-12d3-a456-426614174000";
  const validGameId = "333e7890-e89b-12d3-a456-426614174000";
  const invalidGameId = "invalid-game-id";
  const invalidProductId = "invalid-product-id";

  const mockLoan: Loan = {
    id: validLoanId,
    product: {
      id: validProductId,
      game: {
        id: validGameId,
        name: 'Skyjo',
        description: "oui",
        minPlayers: 3,
        maxPlayers: 5,
        minYear: 3,
        difficulty: 3,
        duration: "35min",
        brand: "Magilano",
        tags: [],
        rules: []
      },
      available: true,
      user: { 
        id: "987e6543-e89b-12d3-a456-426614174002",
        username: "John Doe",
        email: "john@doe.fr",
        password: "johnpassword",
        role: Role.Customer,
        creationDate: new Date()
      },
      state: State.BROKEN
    },
    startDate: new Date(),
    endDate: new Date(),
    user: { 
      id: "987e6543-e89b-12d3-a456-426614174002",
      username: "John Doe",
      email: "john@doe.fr",
      password: "johnpassword",
      role: Role.Customer,
      creationDate: new Date()
    },
  };

  beforeEach(async () => {
    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    mockLoanRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanGuard,
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: getRepositoryToken(Loan), useValue: mockLoanRepository },
      ],
    }).compile();

    loanGuard = module.get<LoanGuard>(LoanGuard);
  });

  it('should throw HttpException with BAD_REQUEST status if loanId, productId or gameId is invalid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { loanId: invalidLoanId, productId: invalidProductId, gameId: invalidGameId },
        }),
      }),
    } as ExecutionContext;

    await expect(loanGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(loanGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should throw HttpException with NOT_FOUND status if loan is not found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { loanId: validLoanId, productId: validProductId, gameId: validGameId },
        }),
      }),
    } as ExecutionContext;

    mockLoanRepository.findOne.mockResolvedValue(null);

    await expect(loanGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(loanGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
    });
  });

  it('should allow the request if loan is found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { loanId: validLoanId, productId: validProductId, gameId: validGameId },  // Valid UUIDs
        }),
      }),
    } as ExecutionContext;

    mockLoanRepository.findOne.mockResolvedValue(mockLoan);

    const result = await loanGuard.canActivate(context);
    expect(result).toBe(true);
  });
});
