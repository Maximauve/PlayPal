import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '@/product/controller/product.controller';
import { ProductService } from '@/product/service/product.service';
import { UserService } from '@/user/service/user.service';
import { TranslationService } from '@/translation/translation.service';
import { GameService } from '@/game/service/game.service';
import { Product } from '@/product/product.entity';
import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { State } from '@/product/state.enum';
import { User } from '@/user/user.entity';
import { Role } from '@/user/role.enum';
import { ProductDto } from '@/product/dto/product.dto';
import { AssignDto } from '@/product/dto/assign.dto';
import { Repository } from 'typeorm';
import { Game } from '@/game/game.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductController', () => {
  let productController: ProductController;
  let mockProductService: Partial<ProductService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameService: Partial<GameService>;
  let mockGameRepository: Partial<Repository<Game>>;
  let mockProductRepository: Partial<Repository<Product>>;

  const validGameId = "456e7890-e89b-12d3-a456-426614174003";
  const validProductId = "123e4567-e89b-12d3-a456-426614174001";
  const invalidGameId = "96fdc209-0551-4d67-b9ad-0e9067a44bc4";
  const invalidId = "invalid-id";
  const mockProduct: Product = {
    id: validProductId,
    state: State.GOOD,
    available: true,
    user: null,
    game: { id: validGameId, name: "Skyjo", description: "Un bon jeu", maxPlayers: 5, minPlayers: 2, minYear: 3, difficulty: 3, duration: "35min", rating: [] },
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
    mockProductService = {
      getAllProduct: jest.fn().mockResolvedValue(mockProducts),
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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: UserService, useValue: mockUserService },
        { provide: TranslationService, useValue: mockTranslationService },
        { provide: GameService, useValue: mockGameService },
        { provide: getRepositoryToken(Game), useValue: mockGameRepository },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
  });

  describe('getAllProduct', () => {
    it('should return all products for a valid gameId', async () => {
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);

      const result = await productController.getAllProduct(validGameId);
      expect(result).toEqual(mockProducts);
      expect(mockProductService.getAllProduct).toHaveBeenCalledWith(validGameId);
    });
  });

  describe('getProduct', () => {
    it('should return a product for valid gameId and productId', async () => {

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(mockProduct);

      const result = await productController.getProduct(validGameId, validProductId);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.getProduct).toHaveBeenCalledWith(validGameId, validProductId);
    });
  });

  describe('createProduct', () => {
    it('should create a product for a valid gameId', async () => {
      const productDto: ProductDto = { state: State.LIKE_NEW };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'create').mockResolvedValue(mockProduct);

      const result = await productController.createProduct(mockUser, validGameId, productDto);
      expect(result).toEqual(mockProduct);
    });

    it('should throw HttpException with 500 status if product creation fails', async () => {
      const productDto: ProductDto = { state: State.LIKE_NEW };

      jest.spyOn(mockProductService, 'create').mockResolvedValue(null);

      await expect(productController.createProduct(mockUser, validGameId, productDto)).rejects.toThrow(HttpException);
      await expect(productController.createProduct(mockUser, validGameId, productDto)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('assignProduct', () => {
    it('should assign a product to a user for valid gameId and productId', async () => {
      const assignDto: AssignDto = { userId: mockUser.id };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'assign').mockResolvedValue(mockProduct);

      const result = await productController.assignProduct(validGameId, validProductId, assignDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.assign).toHaveBeenCalledWith(validGameId, validProductId, mockUser);
    });
  });

  describe('unassignProduct', () => {
    it('should unassign a product for valid gameId and productId', async () => {

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'unassign').mockResolvedValue(mockProduct);

      const result = await productController.unassignProduct(validGameId, validProductId);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.unassign).toHaveBeenCalledWith(validGameId, validProductId);
    });
  });

  describe('updateProduct', () => {
    it('should update a product for valid gameId and productId', async () => {
      const productUpdatedDto = { state: State.LIKE_NEW };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'update').mockResolvedValue();

      const result = await productController.updateProduct(validGameId, validProductId, productUpdatedDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.update).toHaveBeenCalledWith(validProductId, productUpdatedDto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product for valid gameId and productId', async () => {

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'delete').mockResolvedValue(undefined);

      await expect(productController.deleteProduct(validGameId, validProductId)).resolves.toBeUndefined();
      expect(mockProductService.delete).toHaveBeenCalledWith(validGameId, validProductId);
    });
  });
});
