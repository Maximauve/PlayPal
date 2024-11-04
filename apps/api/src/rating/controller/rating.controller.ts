import { Controller, Get, HttpException, HttpStatus, Param, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request } from "express";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameService } from "@/game/service/game.service";
import { Rating } from "@/rating/rating.entity";
import { RatingService } from "@/rating/service/rating.service";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";

@UseGuards(JwtAuthGuard)
@ApiTags('rating')
@Controller('rating')
export class RatingController {

  constructor(private ratingService: RatingService, private readonly usersService: UserService, private readonly translationsService: TranslationService, private readonly gameService: GameService) { }

  @Get("/game/:gameId/rating")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: 'Returns all game\'s rating' })
  @ApiOkResponse({ type: Rating, isArray: true })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getAllRating(@Req() request: Request, @Param('gameId') gameId: string): Promise<Rating[]> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return this.ratingService.getAllRating(gameId);
  }

  @Get("/game/:gameId/rating/:ratingId")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Return a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getRating(@Req() request: Request, @Param('gameId') gameId: string, @Param('ratingId') ratingId: string): Promise<Rating> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    const rating = await this.ratingService.getRating(ratingId);
    if (!rating) {
      throw new HttpException(await this.translationsService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return rating;
  }
}