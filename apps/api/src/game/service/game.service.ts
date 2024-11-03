import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type Repository } from "typeorm";

import { GameDto } from "@/game/dto/game.dto";
<<<<<<< HEAD
<<<<<<< HEAD
import { GameUpdatedDto } from "@/game/dto/gameUpdated.dto";
=======
>>>>>>> db782ed (feat(api/games): WIP add games crud)
=======
import { GameUpdatedDto } from "@/game/dto/gameUpdated.dto";
>>>>>>> 2c1d836 (feat(game): finish game and add TU)
import { Game } from "@/game/game.entity";
import { TranslationService } from "@/translation/translation.service";

export class GameService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    private translationService: TranslationService
  ) { }

  async getAll(): Promise<Game[]> {
<<<<<<< HEAD
    return this.gamesRepository.find({
      relations: {
        rating: true,
        product: true
      }
    });
  }

  async create(game: GameDto): Promise<Game | null> {
=======
    return this.gamesRepository.find();
  }

<<<<<<< HEAD
  async create(game: Game): Promise<Game> {
>>>>>>> db782ed (feat(api/games): WIP add games crud)
=======
  async create(game: GameDto): Promise<Game | null> {
>>>>>>> 2c1d836 (feat(game): finish game and add TU)
    const newGame = this.gamesRepository.create(game);
    return this.gamesRepository.save(newGame);
  }

<<<<<<< HEAD
<<<<<<< HEAD
  async update(gameId: string, game: GameUpdatedDto): Promise<void> {
=======
  async update(gameId: string, game: GameDto): Promise<void> {
>>>>>>> db782ed (feat(api/games): WIP add games crud)
=======
  async update(gameId: string, game: GameUpdatedDto): Promise<void> {
>>>>>>> 2c1d836 (feat(game): finish game and add TU)
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
<<<<<<< HEAD
<<<<<<< HEAD
    const game = await this.gamesRepository
      .createQueryBuilder("game")
      .where("game.id = :id", { id: gameId })
      .leftJoinAndSelect("game.rating", "rating")
      .leftJoinAndSelect("game.product", "product")
=======
    const game = await this.gamesRepository.createQueryBuilder("game")
=======
    const game = await this.gamesRepository
      .createQueryBuilder("game")
>>>>>>> 2c1d836 (feat(game): finish game and add TU)
      .where("game.id = :id", { id: gameId })
>>>>>>> db782ed (feat(api/games): WIP add games crud)
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
<<<<<<< HEAD
      .leftJoinAndSelect("game.rating", "rating")
      .leftJoinAndSelect("game.product", "product")
=======
>>>>>>> db782ed (feat(api/games): WIP add games crud)
      .getOne();
    if (!game) {
      return null;
    }
    return game;
  }
}