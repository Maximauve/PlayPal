import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type Repository } from "typeorm";

import { Game } from "@/game/game.entity";
import { RatingDto } from "@/rating/dto/rating.dto";
import { RatingUpdatedDto } from "@/rating/dto/ratingUpdated.dto";
import { Rating } from "@/rating/rating.entity";
import { TranslationService } from "@/translation/translation.service";
import { User } from "@/user/user.entity";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly translationsService: TranslationService
  ) { }

  async getAllRating(gameId: string): Promise<Rating[]> {
    return this.ratingRepository
      .createQueryBuilder('rating')
      .where("rating.gameId = :id", { id: gameId })
      .leftJoinAndSelect("rating.user", "user")
      .leftJoinAndSelect("rating.game", "game")
      .getMany();
  }

  async getRating(gameId: string, ratingId: string): Promise<Rating | null> {
    return this.ratingRepository
      .createQueryBuilder("rating")
      .leftJoinAndSelect("rating.user", "user")
      .leftJoinAndSelect("rating.game", "game")
      .where("rating.gameId = :gameId", { gameId: gameId })
      .andWhere("rating.id = :ratingId", { ratingId: ratingId })
      .getOne();
  }

  async create(gameId: string, userId: string, ratingDto: RatingDto): Promise<Rating | null> {
    const game = await this.gameRepository
      .createQueryBuilder("game")
      .where("game.id = :id", { id: gameId })
      .getOne();
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .getOne();
    if (!user) {
      throw new HttpException(await this.translationsService.translate("error.USER_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const existingRating = await this.getRating(gameId, userId);
    if (existingRating) {
      // user cant create note 2 times for one game
      throw new HttpException(await this.translationsService.translate("error.RATING_ALREADY_EXIST"), HttpStatus.CONFLICT);
    }
    const rating = this.ratingRepository.create({
      ...ratingDto,
      user,
      game,
    });
    return this.ratingRepository.save(rating);
  }

  async update(ratingId: string, ratingUpdatedDto: RatingUpdatedDto): Promise<void> {
    const query = await this.ratingRepository
      .createQueryBuilder()
      .update(Rating)
      .set(ratingUpdatedDto)
      .where("id = :id", { id: ratingId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate('error.RATING_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
  }

  async delete(gameId: string, ratingId: string): Promise<void> {
    const query = await this.ratingRepository
      .createQueryBuilder()
      .delete()
      .from(Rating)
      .where("rating.id = :id", { id: ratingId })
      .andWhere('rating."gameId" = :gameId', { gameId: gameId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate("error.RATING_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
  }
}