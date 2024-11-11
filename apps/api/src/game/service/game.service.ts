import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type Repository } from "typeorm";

import { GameDto } from "@/game/dto/game.dto";
import { GameUpdatedDto } from "@/game/dto/gameUpdated.dto";
import { Game } from "@/game/game.entity";
import { TranslationService } from "@/translation/translation.service";

export class GameService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private translationService: TranslationService
  ) { }

  async getAll(): Promise<Game[]> {
    return this.gamesRepository.find({
      relations: {
        rating: true
      }
    });
  }

  async create(game: GameDto): Promise<Game | null> {
    const newGame = this.gamesRepository.create(game);
    return this.gamesRepository.save(newGame);
  }

  async update(gameId: string, game: GameUpdatedDto): Promise<void> {
    const query = await this.gamesRepository
      .createQueryBuilder()
      .update(Game)
      .set(game)
      .where("id = :id", { id: gameId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return;
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
    return;
  }

  async findOneGame(gameId: string): Promise<Game | null> {
    const game = await this.gamesRepository
      .createQueryBuilder("game")
      .where("game.id = :id", { id: gameId })
      .leftJoinAndSelect("game.rating", "rating")
      .getOne();
    if (!game) {
      return null;
    }
    return game;
  }

  async findOneName(name: string): Promise<Game | null> {
    const game = await this.gamesRepository
      .createQueryBuilder("game")
      .where("game.name = :name", { name })
      .leftJoinAndSelect("game.rating", "rating")
      .getOne();
    if (!game) {
      return null;
    }
    return game;
  }
}