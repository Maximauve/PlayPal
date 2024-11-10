import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TagDto } from "@/tag/dto/tag.dto";
import { Tag } from "@/tag/tag.entity";
import { TranslationService } from "@/translation/translation.service";

export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly translationService: TranslationService
  ) { }

  async getAll(): Promise<Tag[]> {
    return this.tagRepository.find(
      { relations: {
        games: true
      } }
    );
  }

  async create(tag: TagDto): Promise<Tag | null> {
    const newTag = this.tagRepository.create(tag);
    return this.tagRepository.save(newTag);
  }

  async update(tagId: string, tag: TagDto): Promise<void> {
    const existingTag = await this.tagRepository.findOneBy({ id: tagId });

    if (!existingTag) {
      throw new HttpException(await this.translationService.translate('error.TAG_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    await this.tagRepository.update(tagId, tag);
    return;
  }

  async delete(tagId: string): Promise<void> {
    const existingTag = await this.tagRepository.findOneBy({ id: tagId });

    if (!existingTag) {
      throw new HttpException(await this.translationService.translate('error.TAG_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

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
    if (!tag) {
      return null;
    }
    return tag;
  }
}