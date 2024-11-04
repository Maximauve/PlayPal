import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type Repository } from "typeorm";

import { Rating } from "@/rating/rating.entity";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
  ) { }

  async getAllRating(gameId: string): Promise<Rating[]> {
    return this.ratingRepository
      .createQueryBuilder('rating')
      .where("rating.gameId = :id", { id: gameId })
      .getMany();
  }

  async getRating(ratingId: string): Promise<Rating | null> {
    return this.ratingRepository
      .createQueryBuilder("rating")
      .where("rating.id = :id", { id: ratingId })
      .leftJoinAndSelect("rating.user", "user")
      .getOne();
  }
}