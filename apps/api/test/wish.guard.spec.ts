import { TranslationService } from "@/translation/translation.service";
import { Role } from "@/user/role.enum";
import { WishController } from "@/wish/controller/wish.controller";
import { WishGuard } from "@/wish/guards/wish.guard";
import { Wish } from "@/wish/wish.entity";
import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mock } from "node:test";
import { Repository } from "typeorm";


describe('WishGuard', () => { 
    let wishGuard: WishGuard;
    let mockTranslationService: Partial<TranslationService>;
    let mockWishRepository: jest.Mocked<Repository<Wish>>;

    const validGameId = "222e4567-e89b-12d3-a456-426614174000";
    const invalidGameId = "invalid-game-id";
    const validWishId = "111e7890-e89b-12d3-a456-426614174000";
    const invalidWishId = "invalid-id";
    const mockWish: Wish = {
        id: validWishId,
        user: { 
            id: "987e6543-e89b-12d3-a456-426614174002",
            username: "John Doe",
            email: "john@doe.fr",
            password: "johnpassword",
            role: Role.Customer,
            creationDate: new Date()
        },
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
            rules: []
        },
        date: new Date()
    };

    beforeEach(async () => {
        mockTranslationService = {
            translate: jest.fn().mockResolvedValue('Translated error message'),
        };

        mockWishRepository = {
            findOne: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                WishGuard,
                { provide: TranslationService, useValue: mockTranslationService },
                { provide: getRepositoryToken(Wish), useValue: mockWishRepository },
            ],
        }).compile();

        wishGuard = module.get<WishGuard>(WishGuard);
    });

    it('should throw HttpException with 400 status if wishId or GameId is invalid', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    params: {
                        wishId: invalidWishId,
                        gameId: invalidGameId
                    }
                }),
            }),
        } as ExecutionContext;

        await expect(wishGuard.canActivate(context)).rejects.toThrow(HttpException);
        await expect(wishGuard.canActivate(context)).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
        }
        );
    });

    it('should throw HttpException with 404 status if wish not found', async () => {
        mockWishRepository.findOne.mockResolvedValue(null);

        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    params: {
                        wishId: validWishId,
                        gameId: validGameId
                    }
                }),
            }),
        } as ExecutionContext;

        mockWishRepository.findOne.mockResolvedValue(null);

        

        await expect(wishGuard.canActivate(context)).rejects.toThrow(HttpException);
        await expect(wishGuard.canActivate(context)).rejects.toMatchObject({
            status: HttpStatus.NOT_FOUND,
        }
        );
    });

    it('should allow the request if wish is found', async () => {
        mockWishRepository.findOne.mockResolvedValue(mockWish);

        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    params: {
                        wishId: validWishId,
                        gameId: validGameId
                    }
                }),
            }),
        } as ExecutionContext;

        mockWishRepository.findOne.mockResolvedValue(mockWish);

        await expect(wishGuard.canActivate(context)).resolves.toBe(true);
    });

});