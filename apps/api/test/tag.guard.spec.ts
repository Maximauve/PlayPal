import { Tag } from '@playpal/schemas';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { TagGuard } from '@/tag/guards/tag.guard';
import { TranslationService } from '@/translation/translation.service';
import { Repository } from 'typeorm';

describe('TagGuard', () => {
  let tagGuard: TagGuard;
  let mockTranslationService: Partial<TranslationService>;
  let mockTagRepository: jest.Mocked<Repository<Tag>>;

  const validTagId = "111e7890-e89b-12d3-a456-426614174000";
  const invalidTagId = "invalid-id";
  const validGameId = "222e4567-e89b-12d3-a456-426614174000";
  const invalidGameId = "invalid-game-id";
  const mockTag: Tag = {
    id: validTagId,
    name: 'Adventure',
    games: [
      {
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
      }
    ]
  };

  beforeEach(() => {
    mockTranslationService = {
      translate: jest.fn().mockResolvedValue('translated message')
    };

    mockTagRepository = {
      findOne: jest.fn()
    } as any;

    tagGuard = new TagGuard(mockTagRepository, mockTranslationService as TranslationService);
  });

  it('should throw HttpException with 400 status if tagId or gameId is not a valid uuid', async () => {
    const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            params: { tagId: invalidTagId, gameId: invalidGameId },
          }),
        }),
      } as ExecutionContext;

    await expect(tagGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(tagGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
    });
  });

  it('should throw HttpException with 404 status if tag is not found', async () => {
    mockTagRepository.findOne.mockResolvedValueOnce(null);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { tagId: validTagId },
        }),
      }),
    } as ExecutionContext;

    await expect(tagGuard.canActivate(context)).rejects.toThrow(HttpException);
    await expect(tagGuard.canActivate(context)).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
    });
  });

  it('should allow the request if tag is found', async () => {
    mockTagRepository.findOne.mockResolvedValueOnce(mockTag);

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          params: { tagId: validTagId },
        }),
      }),
    } as ExecutionContext;

    expect(await tagGuard.canActivate(context)).toBe(true);
  });
});
