import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "@playpal/schemas";
import { Repository } from "typeorm";

import { RequestWithGame } from "@/game/types/RequestWithGame";
import { TranslationService } from "@/translation/translation.service";
import { uuidRegex } from "@/utils/regex.variable";

@Injectable()
export class GameGuard implements CanActivate {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private readonly translationsService: TranslationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithGame>();
    const gameId = request.params.gameId;

    if (!uuidRegex.test(gameId)) {
      throw new HttpException(await this.translationsService.translate("error.ID_INVALID"), HttpStatus.BAD_REQUEST);
    }

    const game = await this.gameRepository.findOne({ 
      where: { 
        id: gameId 
      },
      relations: {
        rating: true,
        product: true
      }
    });
    
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    request.game = game;
    return true;
  }
}
