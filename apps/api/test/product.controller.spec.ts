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

describe('ProductController', () => {
  let productController: ProductController;
  let mockProductService: Partial<ProductService>;
  let mockUserService: Partial<UserService>;
  let mockTranslationService: Partial<TranslationService>;
  let mockGameService: Partial<GameService>;

  const validGameId = "456e7890-e89b-12d3-a456-426614174003";
  const validProductId = "123e4567-e89b-12d3-a456-426614174001";
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
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
  });

  describe('getAllProduct', () => {
    it('should return all products for a valid gameId', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);

      const result = await productController.getAllProduct(mockRequest, validGameId);
      expect(result).toEqual(mockProducts);
      expect(mockProductService.getAllProduct).toHaveBeenCalledWith(validGameId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(productController.getAllProduct(mockRequest, validGameId)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(productController.getAllProduct(mockRequest, invalidId)).rejects.toThrow(HttpException);
      await expect(productController.getAllProduct(mockRequest, invalidId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(productController.getAllProduct(mockRequest, validGameId)).rejects.toThrow(HttpException);
      await expect(productController.getAllProduct(mockRequest, validGameId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('getProduct', () => {
    it('should return a product for valid gameId and productId', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(mockProduct);

      const result = await productController.getProduct(mockRequest, validGameId, validProductId);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.getProduct).toHaveBeenCalledWith(validGameId, validProductId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(productController.getProduct(mockRequest, validGameId, validProductId)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or productId is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(productController.getProduct(mockRequest, invalidId, validProductId)).rejects.toThrow(HttpException);
      await expect(productController.getProduct(mockRequest, invalidId, validProductId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(productController.getProduct(mockRequest, validGameId, invalidId)).rejects.toThrow(HttpException);
      await expect(productController.getProduct(mockRequest, validGameId, invalidId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(productController.getProduct(mockRequest, validGameId, validProductId)).rejects.toThrow(HttpException);
      await expect(productController.getProduct(mockRequest, validGameId, validProductId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw HttpException with 404 status if product not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'getProduct').mockResolvedValue(null);

      await expect(productController.getProduct(mockRequest, validGameId, validProductId)).rejects.toThrow(HttpException);
      await expect(productController.getProduct(mockRequest, validGameId, validProductId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('createProduct', () => {
    it('should create a product for a valid gameId', async () => {
      const mockRequest = {} as Request;
      const productDto: ProductDto = { state: State.LIKE_NEW };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'create').mockResolvedValue(mockProduct);

      const result = await productController.createProduct(mockRequest, validGameId, productDto);
      expect(result).toEqual(mockProduct);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(productController.createProduct(mockRequest, validGameId, {} as ProductDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId is invalid', async () => {
      const mockRequest = {} as Request;
      const productDto: ProductDto = { state: State.LIKE_NEW };

      await expect(productController.createProduct(mockRequest, invalidId, productDto)).rejects.toThrow(HttpException);
      await expect(productController.createProduct(mockRequest, invalidId, productDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      const productDto: ProductDto = { state: State.LIKE_NEW };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(productController.createProduct(mockRequest, validGameId, productDto)).rejects.toThrow(HttpException);
      await expect(productController.createProduct(mockRequest, validGameId, productDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw HttpException with 500 status if product creation fails', async () => {
      const mockRequest = {} as Request;
      const productDto: ProductDto = { state: State.LIKE_NEW };

      jest.spyOn(mockProductService, 'create').mockResolvedValue(null);

      await expect(productController.createProduct(mockRequest, validGameId, productDto)).rejects.toThrow(HttpException);
      await expect(productController.createProduct(mockRequest, validGameId, productDto)).rejects.toMatchObject({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    });
  });

  describe('assignProduct', () => {
    it('should assign a product to a user for valid gameId and productId', async () => {
      const mockRequest = {} as Request;
      const assignDto: AssignDto = { userId: mockUser.id };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'assign').mockResolvedValue(mockProduct);

      const result = await productController.assignProduct(mockRequest, validGameId, validProductId, assignDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.assign).toHaveBeenCalledWith(validGameId, validProductId, mockUser);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      const assignDto: AssignDto = { userId: mockUser.id };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(productController.assignProduct(mockRequest, validGameId, validProductId, assignDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or productId is invalid', async () => {
      const mockRequest = {} as Request;
      const assignDto: AssignDto = { userId: mockUser.id };

      await expect(productController.assignProduct(mockRequest, invalidId, validProductId, assignDto)).rejects.toThrow(HttpException);
      await expect(productController.assignProduct(mockRequest, invalidId, validProductId, assignDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(productController.assignProduct(mockRequest, validGameId, invalidId, assignDto)).rejects.toThrow(HttpException);
      await expect(productController.assignProduct(mockRequest, validGameId, invalidId, assignDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game or user not found', async () => {
      const mockRequest = {} as Request;
      const assignDto: AssignDto = { userId: "fb47b7d6-3f40-441d-8ba8-dedf5f84f1a2" };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockUserService, 'findOneUser').mockResolvedValue(null);

      await expect(productController.assignProduct(mockRequest, validGameId, validProductId, assignDto)).rejects.toThrow(HttpException);
      await expect(productController.assignProduct(mockRequest, validGameId, validProductId, assignDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw HttpException with 404 status if product not found', async () => {
      const mockRequest = {} as Request;
      const assignDto: AssignDto = { userId: mockUser.id };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'assign').mockResolvedValue(null);

      await expect(productController.assignProduct(mockRequest, validGameId, validProductId, assignDto)).rejects.toThrow(HttpException);
      await expect(productController.assignProduct(mockRequest, validGameId, validProductId, assignDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('unassignProduct', () => {
    it('should unassign a product for valid gameId and productId', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'unassign').mockResolvedValue(mockProduct);

      const result = await productController.unassignProduct(mockRequest, validGameId, validProductId);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.unassign).toHaveBeenCalledWith(validGameId, validProductId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(productController.unassignProduct(mockRequest, validGameId, validProductId)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or productId is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(productController.unassignProduct(mockRequest, invalidId, validProductId)).rejects.toThrow(HttpException);
      await expect(productController.unassignProduct(mockRequest, invalidId, validProductId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(productController.unassignProduct(mockRequest, validGameId, invalidId)).rejects.toThrow(HttpException);
      await expect(productController.unassignProduct(mockRequest, validGameId, invalidId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(productController.unassignProduct(mockRequest, validGameId, validProductId)).rejects.toThrow(HttpException);
      await expect(productController.unassignProduct(mockRequest, validGameId, validProductId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('should throw HttpException with 404 status if product not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockProductService, 'unassign').mockResolvedValue(null);

      await expect(productController.unassignProduct(mockRequest, validGameId, validProductId)).rejects.toThrow(HttpException);
      await expect(productController.unassignProduct(mockRequest, validGameId, validProductId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product for valid gameId and productId', async () => {
      const mockRequest = {} as Request;
      const productUpdatedDto = { state: State.LIKE_NEW };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'update').mockResolvedValue();

      const result = await productController.updateProduct(mockRequest, validGameId, validProductId, productUpdatedDto);
      expect(result).toEqual(mockProduct);
      expect(mockProductService.update).toHaveBeenCalledWith(validProductId, productUpdatedDto);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      const productUpdatedDto = { state: State.LIKE_NEW };

      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(productController.updateProduct(mockRequest, validGameId, validProductId, productUpdatedDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or productId is invalid', async () => {
      const mockRequest = {} as Request;
      const productUpdatedDto = { state: State.LIKE_NEW };

      await expect(productController.updateProduct(mockRequest, invalidId, validProductId, productUpdatedDto)).rejects.toThrow(HttpException);
      await expect(productController.updateProduct(mockRequest, invalidId, validProductId, productUpdatedDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(productController.updateProduct(mockRequest, validGameId, invalidId, productUpdatedDto)).rejects.toThrow(HttpException);
      await expect(productController.updateProduct(mockRequest, validGameId, invalidId, productUpdatedDto)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      const productUpdatedDto = { state: State.LIKE_NEW };

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(productController.updateProduct(mockRequest, validGameId, validProductId, productUpdatedDto)).rejects.toThrow(HttpException);
      await expect(productController.updateProduct(mockRequest, validGameId, validProductId, productUpdatedDto)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product for valid gameId and productId', async () => {
      const mockRequest = {} as Request;

      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockProduct.game);
      jest.spyOn(mockProductService, 'delete').mockResolvedValue(undefined);

      await expect(productController.deleteProduct(mockRequest, validGameId, validProductId)).resolves.toBeUndefined();
      expect(mockProductService.delete).toHaveBeenCalledWith(validGameId, validProductId);
    });

    it('should throw UnauthorizedException if user is not authenticated', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(null);

      await expect(productController.deleteProduct(mockRequest, validGameId, validProductId)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException with 400 status if gameId or productId is invalid', async () => {
      const mockRequest = {} as Request;

      await expect(productController.deleteProduct(mockRequest, invalidId, validProductId)).rejects.toThrow(HttpException);
      await expect(productController.deleteProduct(mockRequest, invalidId, validProductId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(productController.deleteProduct(mockRequest, validGameId, invalidId)).rejects.toThrow(HttpException);
      await expect(productController.deleteProduct(mockRequest, validGameId, invalidId)).rejects.toMatchObject({
        status: HttpStatus.BAD_REQUEST,
      });
    });

    it('should throw HttpException with 404 status if game not found', async () => {
      const mockRequest = {} as Request;
      jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(null);

      await expect(productController.deleteProduct(mockRequest, validGameId, validProductId)).rejects.toThrow(HttpException);
      await expect(productController.deleteProduct(mockRequest, validGameId, validProductId)).rejects.toMatchObject({
        status: HttpStatus.NOT_FOUND,
      });
    });
  });
});
