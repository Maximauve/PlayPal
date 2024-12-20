import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '@/product/controller/product.controller';
import { ProductService } from '@/product/service/product.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { GameService } from '@/game/service/game.service';
import { Product, State, User, Role, Game } from '@playpal/schemas';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductDto } from '@/product/dto/product.dto';
import { AssignDto } from '@/product/dto/assign.dto';
import { Repository } from 'typeorm';

import { getRepositoryToken } from '@nestjs/typeorm';import { ProductUpdatedDto } from '@/product/dto/productUpdated.dto';
import { LoanService } from '@/loan/service/loan.service';

describe('ProductController', () => {
  let productController: ProductController;
  let mockProductService: Partial<ProductService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameService: Partial<GameService>;
  let mockGameRepository: Partial<Repository<Game>>;
  let mockProductRepository: Partial<Repository<Product>>;
  let mockLoanService: Partial<LoanService>;

  const validGameId = "456e7890-e89b-12d3-a456-426614174003";
  const validProductId = "123e4567-e89b-12d3-a456-426614174001";
  const invalidGameId = "96fdc209-0551-4d67-b9ad-0e9067a44bc4";
  const invalidId = "invalid-id";

  const mockGame: Game = {
    id: validGameId,
    name: "6-qui-prends",
    description: "Un jeu de taureaux",
    minPlayers: 3,
    maxPlayers: 8,
    duration: "45",
    difficulty: 3,
    minYear: 10,
    brand: "Magilano",
    rating: [],
    tags: [],
    rules: [],
    averageRating: 2,
    count: []
  }

  const mockProduct: Product = {
    id: validProductId,
    state: State.GOOD,
    available: true,
    user: null,
    game: {
      id: validGameId, name: "Skyjo", description: "Un bon jeu", maxPlayers: 5, minPlayers: 2, minYear: 3, difficulty: 3, duration: "35min", brand: "Gigamic", rating: [], tags: [],
      rules: [],
      averageRating: 2,
      count: []
    },
    loan: []
  };

  const mockUser: User = { 
    id: "987e6543-e89b-12d3-a456-426614174002",
    username: "John Doe",
    email: "john@doe.fr",
    password: "johnpassword",
    role: Role.Customer,
    creationDate: new Date()
  };

  const mockProducts: Product[] = [mockProduct];

  beforeEach(async () => {
    mockGameRepository = {
      findOne: jest.fn().mockResolvedValue(mockGame),
    };

    mockProductRepository = {
      findOne: jest.fn().mockResolvedValue(mockProduct),
      find: jest.fn().mockResolvedValue(mockProducts),
    };

    mockProductService = {
      getAllProducts: jest.fn().mockResolvedValue(mockProducts),
      getProduct: jest.fn().mockResolvedValue(mockProduct),
      create: jest.fn().mockResolvedValue(mockProduct),
      assign: jest.fn().mockResolvedValue(mockProduct),
      unassign: jest.fn().mockResolvedValue(mockProduct),
      update: jest.fn().mockResolvedValue(mockProduct),
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
      findOneGame: jest.fn().mockResolvedValue(mockProduct.game),
    };

    mockLoanService = {}

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: GameService, useValue: mockGameService },
        { provide: getRepositoryToken(Game), useValue: mockGameRepository },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
        { provide: LoanService, useValue: mockLoanService },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
  });

  describe('getAllProduct', () => {
    it('should return all products for a valid gameId', async () => {
      jest.spyOn(mockProductService, 'getAllProducts').mockResolvedValue(mockProducts);

      const result = await productController.getAllProduct();
      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProduct', () => {
    it('should return a product for valid gameId and productId', async () => {
      const result = productController.getProduct(mockProduct);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('createProduct', () => {
    it('should create a product for a valid gameId', async () => {
      const productDto: ProductDto = { state: State.LIKE_NEW, gameId: mockGame.id };

      jest.spyOn(mockProductService, 'create').mockResolvedValue(mockProduct);

      const result = await productController.createProduct(productDto);
      expect(result).toEqual(mockProduct);
    });

    it('should throw HttpException with 500 status if product creation fails', async () => {
      const productDto: ProductDto = { state: State.LIKE_NEW, gameId: mockGame.id };

      jest.spyOn(mockProductService, 'create').mockResolvedValue(null);

      await expect(productController.createProduct(productDto)).rejects.toThrow(HttpException);
      await expect(productController.createProduct(productDto)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('assignProduct', () => {
    it('should assign a product to a user for valid gameId and productId', async () => {
      const assignDto: AssignDto = { userId: mockUser.id };

      const assignProduct: Product = {
        ...mockProduct,
        user: mockUser,
        available: false
      }

      jest.spyOn(mockProductService, 'assign').mockResolvedValue(assignProduct);

      const result = await productController.assignProduct(mockProduct, assignDto);
      expect(result).toEqual(assignProduct);
      expect(mockProductService.assign).toHaveBeenCalledWith(mockProduct, mockUser);
    });
  });

  describe('unassignProduct', () => {
    it('should unassign a product for valid gameId and productId', async () => {
      const unassignProduct: Product = {
        ...mockProduct,
        user: null,
        available: true
      }

      jest.spyOn(mockProductService, 'unassign').mockResolvedValue(unassignProduct);

      const result = await productController.unassignProduct(mockProduct);
      expect(result).toEqual(unassignProduct);
      expect(mockProductService.unassign).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product for valid gameId and productId', async () => {
      const productUpdatedDto: ProductUpdatedDto = { state: State.LIKE_NEW };

      jest.spyOn(mockProductService, 'update').mockResolvedValue();

      const result = await productController.updateProduct(mockProduct, productUpdatedDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.update).toHaveBeenCalledWith(validProductId, productUpdatedDto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product for valid gameId and productId', async () => {

      jest.spyOn(mockProductService, 'delete').mockResolvedValue(undefined);

      await expect(productController.deleteProduct(mockProduct)).resolves.toBeUndefined();
      expect(mockProductService.delete).toHaveBeenCalledWith(validProductId);
    });
  });
});
