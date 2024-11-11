import { Test, TestingModule } from '@nestjs/testing';
import { ProductGuard } from '@/product/guards/product.guard';
import { TranslationService } from '@/translation/translation.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '@/product/product.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '@/user/role.enum';
import { State } from '@/product/state.enum';

describe('ProductGuard', () => {
  let productGuard: ProductGuard;
  let mockTranslationService: Partial<TranslationService>;
  let mockProductRepository: jest.Mocked<Repository<Product>>;

  const validProductId = "111e7890-e89b-12d3-a456-426614174000";
  const invalidProductId = "invalid-id";
  const validGameId = "222e4567-e89b-12d3-a456-426614174000";
  const invalidGameId = "invalid-game-id";
  const mockProduct: Product = {
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
      tags: [],
      rating: []
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
  };

  beforeEach(async () => {
    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('Translated error message'),
    };

    mockProductRepository = {
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductGuard,
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
      ],
    }).compile();

    productGuard = module.get<ProductGuard>(ProductGuard);
  });

  it('should throw HttpException with 400 status if productId or gameId is invalid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { productId: invalidProductId, gameId: invalidGameId },
        }),
      }),
    } as ExecutionContext;

    await expect(productGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(productGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should throw HttpException with 404 status if product is not found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { productId: validProductId, gameId: validGameId },
        }),
      }),
    } as ExecutionContext;

    mockProductRepository.findOne.mockResolvedValue(null);

    await expect(productGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(productGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
    });
  });

  it('should allow the request if product is found', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { productId: validProductId, gameId: validGameId },
        }),
      }),
    } as ExecutionContext;

    mockProductRepository.findOne.mockResolvedValue(mockProduct);

    const result = await productGuard.canActivate(context);
    expect(result).toBe(true);  // La requête peut passer
  });
});
