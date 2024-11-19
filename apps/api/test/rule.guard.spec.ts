import { RuleGuard } from "@/rule/guards/rule.guard";
import { Rule } from "@/rule/rule.entity";
import { TranslationService } from "@/translation/translation.service";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

describe('RuleGuard', () => {
    let ruleGuard: RuleGuard;
    let mockTranslationService: Partial<TranslationService>;
    let mockRuleRepository: jest.Mocked<Repository<Rule>>;

    const validRuleId = "111e7890-e89b-12d3-a456-426614174000";
    const invalidRuleId = "invalid-id";
    const validGameId = "222e4567-e89b-12d3-a456-426614174000";
    const invalidGameId = "invalid-game-id";

    const mockRule: Rule = {
        id: validRuleId,
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
        description: "Les règles sont trop cool",
        title: "Règles du jeu",
        youtubeId: "xYX8Z1nz3Y"
    };

    beforeEach(async () => {
        mockTranslationService = {
            translate: jest.fn().mockResolvedValue('Translated error message'),
        };

        mockRuleRepository = {
            findOne: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RuleGuard,
                { provide: TranslationService, useValue: mockTranslationService },
                { provide: getRepositoryToken(Rule), useValue: mockRuleRepository },
            ],
        }).compile();

        ruleGuard = module.get<RuleGuard>(RuleGuard);
    });

    it('should throw HttpException with 400 status if ratingId or gameId is invalid', async () => {
        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    params: { ruleId: invalidRuleId, gameId: invalidGameId },
                }),
            }),
        } as any;

        await expect(ruleGuard.canActivate(context)).rejects.toThrow(HttpException);
        await expect(ruleGuard.canActivate(context)).rejects.toMatchObject({
            status: HttpStatus.BAD_REQUEST,
        });
    });

    it('should throw HttpException with 404 status if rating is not found', async () => {
        mockRuleRepository.findOne.mockResolvedValueOnce(null);

        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    params: { ruleId: validRuleId },
                }),
            }),
        } as any;

        await expect(ruleGuard.canActivate(context)).rejects.toThrow(HttpException);
        await expect(ruleGuard.canActivate(context)).rejects.toMatchObject({
            status: HttpStatus.NOT_FOUND,
        });
    });

    it('should allow the request if rating is found', async () => {
        mockRuleRepository.findOne.mockResolvedValueOnce(mockRule);

        const context = {
            switchToHttp: () => ({
                getRequest: () => ({
                    params: { ruleId: validRuleId , gameId: validGameId },
                }),
            }),
        } as any;

        await expect(ruleGuard.canActivate(context)).resolves.toBe(true);
    });
});