import { TranslationService } from "@/translation/translation.service";
import { WishGuard } from "@/wish/guards/wish.guard";
import { Role, Game, Wish, User } from "@playpal/schemas";
import { WishController } from "@/wish/controller/wish.controller";
import { WishService } from "@/wish/service/wish.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { WishDto } from "@/wish/dto/wish.dto";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "@/user/service/user.service";

describe('WishController', () => {
    let WishGuard: WishGuard;
    let wishController: WishController;
    let mockTranslationService: Partial<TranslationService>;
    let mockWishRepository: jest.Mocked<Repository<Wish>>;
    let mockWishlistService: Partial<WishService>;
    let mockUserService: Partial<UserService>;
    let mockGameRepository: Partial<Repository<Game>>;

    const validGameId = "222e4567-e89b-12d3-a456-426614174000";
    const invalidGameId = "invalid-game-id";
    const validWishId = "111e7890-e89b-12d3-a456-426614174000";
    const invalidWishId = "invalid-id";
    const validUserId = "987e6543-e89b-12d3-a456-426614174002";
    const invalidUserId = "invalid-user-id";
    const mockWish: Wish = {
        id: validWishId,
        user: {
            id: validUserId,
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
            brand: "Magilano",
            tags: [],
            rules: [],
            averageRating: 2,
            count: []
        },
        date: new Date()
    };

    beforeEach(async () => {
        mockGameRepository = {};
        
        mockTranslationService = {
            translate: jest.fn().mockResolvedValue('Translated error message'),
        };

        mockWishRepository = {
            findOne: jest.fn(),
        } as any;

        mockWishlistService = {
            getAllWishes: jest.fn().mockResolvedValue([mockWish]),
            getAllWishesForGame: jest.fn().mockResolvedValue([mockWish]),
            getWish: jest.fn().mockResolvedValue(mockWish),
            create: jest.fn().mockResolvedValue(mockWish),
            updateWish: jest.fn().mockResolvedValue(mockWish),
            deleteWish: jest.fn().mockResolvedValue(null),
        };

        mockUserService = {
            
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [WishController],
            providers: [
                { provide: TranslationService, useValue: mockTranslationService },
                { provide: getRepositoryToken(Game), useValue: mockGameRepository },
                { provide: WishService, useValue: mockWishlistService },
                { provide: getRepositoryToken(Wish), useValue: mockWishRepository },
                {provide:UserService, useValue: mockUserService},

            ],
        }).compile();

        wishController = module.get<WishController>(WishController);

    });

    describe('getAllWishes', () => {
        it('should return all wishes for a valid gameId', async () => {
            const result = await wishController.getAllWishes();
            expect(result).toEqual([mockWish]);
        });

    });

    describe('getWish', () => {
        it('should return a wish for a valid wishId', async () => {
            const result = await wishController.getWish(mockWish);
            expect(result).toEqual(mockWish);
        });

    });

    describe('createWish', () => {
        const mockWishDto: WishDto = { gameId: validGameId };

        it('should create a wish', async () => {
            const result = await wishController.createWish(mockWishDto, mockWish.user);
            expect(result).toEqual(mockWish);
        });

    });

    describe('updateWish', () => {
        const mockWishDto: WishDto = { gameId: validGameId};

        it('should update a wish', async () => {
            const result = await wishController.updateWish(mockWish, mockWishDto);
            expect(result).toEqual(mockWish);
        });

    });

    describe('deleteWish', () => {
        it('should delete a wish', async () => {
            const result = await wishController.deleteWish(mockWish);
            expect(result).toBeNull();
        });

    });

});
