import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, Product } from "@playpal/schemas";
import { type Repository } from "typeorm";

import { GameDto } from "@/game/dto/game.dto";
import { GameUpdatedDto } from "@/game/dto/gameUpdated.dto";
import { TagService } from "@/tag/service/tag.service";
import { TranslationService } from "@/translation/translation.service";

export class GameService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private tagsRepository: TagService,
    private translationService: TranslationService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) { }

  async getAll(page: number, limit: number, tags?: string[] | string, search?: string): Promise<{ data: Game[]; total: number }> {
    const query = this.gamesRepository.createQueryBuilder('game')
      .leftJoinAndSelect('game.rating', 'rating')
      .leftJoinAndSelect('game.product', 'product')
      .leftJoinAndSelect('game.tags', 'tags');
    if (tags && tags.length > 0) {
      query.andWhere('tags.name IN (:...tags)', { tags: Array.isArray(tags) ? tags : [tags] });
    }
    if (search) {
      query.andWhere(
        '(LOWER(game.name) LIKE :search OR LOWER(game.description) LIKE :search OR LOWER(game.brand) LIKE :search)',
        { search: `%${search.toLocaleLowerCase()}%` }
      );
    }
    const offset = (page - 1) * limit;
    const total = await query.getCount();
    const games: Game[] = await query
      .skip(offset)
      .take(limit)
      .getMany();

    await Promise.all(games.map(async (game) => {
      game.tags = await this.gamesRepository
        .createQueryBuilder('game')
        .relation('tags')
        .of(game)
        .loadMany();
    })); // tags are not loaded at all when they are filtered

    return { data: games, total };
  }

  async getRecommendations(limit: number): Promise<{ data: Game[] }> {
    const games: Game[] = await this.gamesRepository.createQueryBuilder("game")
      .leftJoinAndSelect("game.rating", "rating")
      .leftJoinAndSelect("game.product", "product")
      .leftJoinAndSelect("game.tags", "tags")
      .orderBy("rating.note", "DESC")
      .limit(limit)
      .getMany();

    return { data: games };
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
      throw new HttpException(
        await this.translationService.translate('error.GAME_NOT_FOUND'),
        HttpStatus.NOT_FOUND
      );
    }
  
    const { tagIds, ...gameData } = game;
  
    Object.assign(existingGame, gameData);
  
    if (tagIds) {
      const tags = await this.tagsRepository.getByIds(tagIds);
      if (tags.length !== tagIds.length) {
        throw new HttpException(
          await this.translationService.translate("error.TAGS_NOT_FOUND"),
          HttpStatus.NOT_FOUND
        );
      }
      existingGame.tags = tags;
    }
  
    await this.gamesRepository.save(existingGame);
  
    return this.findOneGame(gameId);
  }

  async delete(gameId: string): Promise<void> {
    const game = await this.gamesRepository.findOne({
      where: { id: gameId },
      relations: ['rating', 'product', 'wish', 'rules', 'tags'],
    });
  
    if (!game) {
      throw new HttpException(await this.translationService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    if (game.tags && game.tags.length > 0) {
      game.tags = [];
      await this.gamesRepository.save(game);
    }

    const query = await this.gamesRepository
      .createQueryBuilder()
      .delete()
      .from(Game)
      .where('id = :id', { id: gameId })
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

  async getGameNotes(gameId: string) {

    const noteCount = await this.gamesRepository.createQueryBuilder("game")
      .leftJoin("game.rating", "rating")
      .where("game.id = :id", { id: gameId })
      .select("rating.note", "note")
      .addSelect("COUNT(rating.note)", "count")
      .groupBy("rating.note")
      .getRawMany();

    return {
      noteCount: noteCount
    };
  }

  async getThreeLastGames(): Promise<Game[]> {
    return this.gamesRepository
      .createQueryBuilder("game")
      .where("game.image IS NOT NULL AND game.image != ''")
      .orderBy("game.id", "DESC")
      .leftJoinAndSelect("game.rating", "rating")
      .leftJoinAndSelect("game.product", "product")
      .leftJoinAndSelect("game.tags", "tag")
      .take(3)
      .getMany();
  }

  async findOneName(name: string): Promise<Game | null> {
    return this.gamesRepository
      .createQueryBuilder("game")
      .where("game.name = :name", { name })
      .leftJoinAndSelect("game.rating", "rating")
      .leftJoinAndSelect("game.product", "product")
      .getOne();
  }

  async hasProductAvailable(gameId: string): Promise<boolean> {
    const query = await this.productRepository
      .createQueryBuilder("product")
      .where("product.gameId = :gameId", { gameId: gameId })
      .andWhere("product.available = TRUE")
      .getCount();

    return query > 0;
  }
}
