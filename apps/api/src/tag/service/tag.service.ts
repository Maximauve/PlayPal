import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, Tag } from "@playpal/schemas";
import { In, Repository } from "typeorm";

import { TagDto } from "@/tag/dto/tag.dto";
import { TagUpdatedDto } from "@/tag/dto/tagUpdated.dto";
import { TranslationService } from "@/translation/translation.service";

export class TagService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly translationService: TranslationService
  ) { }

  async getAllByGameId(gameId: string): Promise<Tag[] | undefined> {
    const game = await this.gameRepository.findOne({
      where: {
        id: gameId
      },
      relations: {
        tags: true
      }
    });

    if (!game) {
      throw new HttpException(await this.translationService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    return game.tags;
  }

  async getAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async create(tag: TagDto): Promise<Tag | null> {
    const newTag = this.tagRepository.create(tag);
    return this.tagRepository.save(newTag);
  }

  async update(tagId: string, tag: TagUpdatedDto): Promise<void> {
    await this.tagRepository.update(tagId, tag);
    return;
  }

  async delete(tagId: string): Promise<void> {
    await this.tagRepository.delete(tagId);
    return;
  }

  async getOne(tagId: string): Promise<Tag | null> {
    return this.tagRepository.findOneBy({ id: tagId });
  }

  async getOneByName(name: string): Promise<Tag | null> {
    const tag = this.tagRepository
      .createQueryBuilder('tag')
      .where('tag.name = :name', { name })
      .getOne();
    return tag;
  }

  async getByIds(ids: string[]): Promise<Tag[]> {
    const tags = await this.tagRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (tags.length !== ids.length) {
      const foundIds = new Set(tags.map(tag => tag.id));
      const missingIds = ids.filter(id => !foundIds.has(id));
      throw new HttpException(await this.translationService.translate('error.MISSING_TAGS', { args: { missing: missingIds.join(', ') } }), HttpStatus.NOT_FOUND);
    }

    return tags;
  }

  async checkIsInGame(tagId: string): Promise<boolean> {
    const exists = await this.tagRepository
      .createQueryBuilder('tag')
      .innerJoin('tag.games', 'game')
      .where('tag.id = :tagId', { tagId })
      .getOne();
    return !!exists;
  }
}
