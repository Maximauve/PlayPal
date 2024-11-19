import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Rating } from "@/rating/rating.entity";
import { RequestWithRating } from "@/rating/types/RequestWithRating";
import { TranslationService } from "@/translation/translation.service";
import { uuidRegex } from "@/utils/regex.variable";

@Injectable()
export class RatingGuard implements CanActivate {
  constructor(
    @InjectRepository(Rating)
    private ratingRepository: Repository<Rating>,
    private readonly translationsService: TranslationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithRating>();
    const ratingId = request.params.ratingId;
    const gameId = request.params.gameId;

    if (!uuidRegex.test(ratingId) || !uuidRegex.test(gameId)) {
      throw new HttpException(await this.translationsService.translate("error.ID_INVALID"), HttpStatus.BAD_REQUEST);
    }

    const rating = await this.ratingRepository.findOne({
      where: {
        id: ratingId,
        game: {
          id: gameId
        }
      },
      relations: {
        game: true,
        user: true
      }
    });
    if (!rating) {
      throw new HttpException(await this.translationsService.translate("error.RATING_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    request.rating = rating;
    return true;
  }
}