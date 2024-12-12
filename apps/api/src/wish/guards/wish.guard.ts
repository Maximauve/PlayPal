import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Wish } from "@playpal/schemas";
import { Repository } from "typeorm/repository/Repository";

import { TranslationService } from "@/translation/translation.service";
import { uuidRegex } from "@/utils/regex.variable";
import { RequestWithWish } from "@/wish/types/RequestWithWish";




@Injectable()
export class WishGuard implements CanActivate {
    
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>, 
    private readonly translationsService: TranslationService ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithWish>();
    const wishId = request.params.wishId;

    if (!uuidRegex.test(wishId)) {
      throw new HttpException(await this.translationsService.translate("error.ID_INVALID"), HttpStatus.BAD_REQUEST);
    }

    const wish = await this.wishRepository.findOne({
      where: {
        id: wishId
      },
      relations: {
        user: true,
        game: {
          rating: true
        }
      }
    });

    if (!wish) {
      throw new HttpException(await this.translationsService.translate("error.WISH_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    request.wish = wish;
    return true;
  }
}
