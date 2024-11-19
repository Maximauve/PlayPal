import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type Repository } from "typeorm";

import { GameDto } from "@/game/dto/game.dto";
import { GameUpdatedDto } from "@/game/dto/gameUpdated.dto";
import { Game } from "@/game/game.entity";
import { TagService } from "@/tag/service/tag.service";
import { TranslationService } from "@/translation/translation.service";

export class GameService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private tagsRepository: TagService,
    private translationService: TranslationService
  ) { }

  async getAll(): Promise<Game[]> {
    return this.gamesRepository.find({
      relations: {
        rating: true,
        product: true,
        tags: true
      }
    });
  }

  async create(game: GameDto): Promise<Game | null> {
    const { tagIds, ...gameData } = game;
    const newGame = this.gamesRepository.create(gameData);
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagsRepository.getByIds(tagIds);
      if (tags.length !== tagIds.length) {
        throw new HttpException(await this.translationService.translate("error.TAGS_NOT_FOUND"), HttpStatus.NOT_FOUND);
      }
      newGame.tags = tags;
    }
    const createdGame = await this.gamesRepository.save(newGame);
    return this.findOneGame(createdGame.id); // have relations in response
  }

  async update(gameId: string, game: GameUpdatedDto): Promise<Game | null> {
    const existingGame = await this.gamesRepository.findOne({ 
      where: { 
        id: gameId
      }, 
      relations: {
        tags: true,
        product: true,
        rating: true
      } 
    });
    if (!existingGame) {
      throw new HttpException(await this.translationService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    const { tagIds, ...gameData } = game; 
    await this.gamesRepository.update(gameId, gameData);
    if (tagIds) {
      const tags = await this.tagsRepository.getByIds(tagIds);
      if (tags.length !== tagIds.length) {
        throw new HttpException(await this.translationService.translate("error.TAGS_NOT_FOUND"), HttpStatus.NOT_FOUND);
      }
      existingGame.tags = tags;
    }
    await this.gamesRepository.save(existingGame);
    return this.findOneGame(gameId); // have relations in response
  }  

  async delete(gameId: string): Promise<void> {
    const query = await this.gamesRepository
      .createQueryBuilder()
      .delete()
      .from(Game)
      .where("id = :id", { id: gameId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
  }

  async findOneGame(gameId: string): Promise<Game | null> {
    return this.gamesRepository
      .createQueryBuilder("game")
      .where("game.id = :id", { id: gameId })
      .leftJoinAndSelect("game.rating", "rating")
      .leftJoinAndSelect("game.product", "product")
      .leftJoinAndSelect("game.tags", "tag")
      .getOne();
  }

  async findOneName(name: string): Promise<Game | null> {
    return this.gamesRepository
      .createQueryBuilder("game")
      .where("game.name = :name", { name })
      .leftJoinAndSelect("game.rating", "rating")
      .leftJoinAndSelect("game.product", "product")
      .getOne();
  }
}
