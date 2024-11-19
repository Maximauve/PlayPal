import { Game } from "@/game/game.entity";
import { GameService } from "@/game/service/game.service";
import { RuleController } from "@/rule/controller/rule.controller";
import { Rule } from "@/rule/rule.entity";
import { RuleService } from "@/rule/service/rule.service";
import { TranslationService } from "@/translation/translation.service";
import { Role } from "@/user/role.enum";
import { UserService } from "@/user/service/user.service";
import { User } from "@/user/user.entity";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { before, mock } from "node:test";
import { Repository } from "typeorm";

describe('RuleController', () => {
    let ruleController: RuleController;
    let mockRuleService: Partial<RuleService>;
    let mockUserService: Partial<UserService>;
    let mockGameService: Partial<GameService>;
    let mockTranslationService: Partial<TranslationService>;
    let mockRuleRepository: Partial<Repository<Rule>>;
    let mockGameRepository: Partial<Repository<Game>>;

    const validGameId = "111e7890-e89b-12d3-a456-426614174000";
    const validRuleId = "222e4567-e89b-12d3-a456-426614174000";
    const invalidId = "invalid-id";

    const mockUser: User = { 
        id: "987e6543-e89b-12d3-a456-426614174002",
        username: "John Doe",
        email: "john@doe.fr",
        password: "johnpassword",
        role: Role.Customer,
        creationDate: new Date()
    };

    const mockGame = {
        id: validGameId,
        name: "6-qui-prends",
        description: "Un jeu de taureaux",
        minPlayers: 3,
        maxPlayers: 8,
        duration: "45",
        difficulty: 3,
        minYear: 10,
        rating: [],
        tags: [],
        rules: []
    };

    const mockRule: Rule = {
            id: validRuleId,
            title: "Règle du jeu à 6",
            youtubeId: "xYX8Z1n5j3Y",
            description: "Les règles du jeu",
            game: mockGame,
    }

    beforeEach(async () => {
        mockRuleService = {
            getAllRules: jest.fn().mockResolvedValue([mockRule]),
            getRule: jest.fn().mockResolvedValue(mockRule),
            create: jest.fn().mockResolvedValue(mockRule),
            update: jest.fn().mockResolvedValue(mockRule),
            delete: jest.fn().mockResolvedValue(null),
        };

        mockUserService = {
            getUserConnected: jest.fn().mockResolvedValue(mockUser),
            findOneUser: jest.fn().mockResolvedValue(mockUser),
        };

        mockTranslationService = {
            translate: jest.fn().mockResolvedValue("Translated error message"),
        };

        mockGameService = {
            findOneGame: jest.fn().mockResolvedValue(mockRule.game),
        }

        const module: TestingModule = await Test.createTestingModule({
            controllers: [RuleController],
            providers: [
                { provide: RuleService, useValue: mockRuleService },
                { provide: UserService, useValue: mockUserService },
                { provide: TranslationService, useValue: mockTranslationService },
                { provide: GameService, useValue: mockGameService },
                { provide: getRepositoryToken(Rule), useValue: mockRuleRepository },
                { provide: getRepositoryToken(Game), useValue: mockGameRepository },
            ],
        }).compile();

        ruleController = module.get<RuleController>(RuleController);
    });

    describe('getAllRules', () => {
        it('should return all rules for a valid game', async () => {
            jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
            jest.spyOn(mockRuleService, 'getAllRules').mockResolvedValue([mockRule]);

            const result = await ruleController.getAllRules(mockGame);
            expect(result).toEqual([mockRule]);
        });
    });

    describe('getRule', () => {
        it('should return a rule for valid gameId and ruleId', async () => {
            jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
            jest.spyOn(mockRuleService, 'getRule').mockResolvedValue(mockRule);

            const result = ruleController.getRule(mockRule);
            expect(result).toEqual(mockRule);
        });
    });

    describe('createRule', () => {
        it('should create a new rule for a valid game', async () => {
            const body = {
                title: "Règles pour jouer à 12",
                youtubeId: "OHSashIHA",
                description: "Ceci est une règle pour jouer à 12",
            }

            jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
            jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
            jest.spyOn(mockRuleService, 'create').mockResolvedValue(mockRule);

            const result = await ruleController.createRule(mockGame, body);
            expect(result).toEqual(mockRule);
            expect(mockRuleService.create).toHaveBeenCalledWith(validGameId, body);
        });

        it('should throw an HttpException with 500 status if rule cannot be created', async () => {
            const body = {
                title: "Règles pour jouer à 12",
                youtubeId: "OHSashIHA",
                description: "Ceci est une règle pour jouer à 12",
            }

            jest.spyOn(mockRuleService, 'create').mockResolvedValue(null);

            await expect(ruleController.createRule(mockGame, body))
                .rejects.toThrow(HttpException);
            await expect(ruleController.createRule(mockGame, body))
                .rejects.toMatchObject({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                });
        });
    });

    describe('updateRule', () => {
        it('should update a rule for valid gameId and ruleId', async () => {
            const body = {
                title: "Règles pour jouer à 12",
                youtubeId: "OHSashIHA",
                description: "Ceci est une règle pour jouer à 12",
            }

            jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
            jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
            jest.spyOn(mockRuleService, 'update').mockResolvedValue(undefined);
            jest.spyOn(mockRuleService, 'getRule').mockResolvedValue(mockRule);

            const result = await ruleController.updateRule(mockGame, mockRule, body);
            expect(result).toEqual(mockRule);
            expect(mockRuleService.update).toHaveBeenCalledWith(validRuleId, body);
            expect(mockRuleService.getRule).toHaveBeenCalledWith(validGameId, mockRule.id);
        });
    });

    describe('deleteRule', () => {
        it('should delete a rule for valid gameId and ruleId', async () => {
            jest.spyOn(mockUserService, 'getUserConnected').mockResolvedValue(mockUser);
            jest.spyOn(mockGameService, 'findOneGame').mockResolvedValue(mockGame);
            jest.spyOn(mockRuleService, 'delete').mockResolvedValue(undefined);

            await expect(ruleController.deleteRule(mockGame, mockRule))
                .resolves.toBeUndefined();
            expect(mockRuleService.delete).toHaveBeenCalledWith(validGameId, validRuleId);
        });
    });
});