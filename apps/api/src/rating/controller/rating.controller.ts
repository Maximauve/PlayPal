import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameRequest } from "@/game/decorators/game.decorator";
import { Game } from "@/game/game.entity";
import { GameGuard } from "@/game/guards/game.guard";
import { GameService } from "@/game/service/game.service";
import { RatingRequest } from "@/rating/decorators/rating.decorator";
import { RatingDto } from "@/rating/dto/rating.dto";
import { RatingUpdatedDto } from "@/rating/dto/ratingUpdated.dto";
import { RatingGuard } from "@/rating/guards/rating.guard";
import { Rating } from "@/rating/rating.entity";
import { RatingService } from "@/rating/service/rating.service";
import { TranslationService } from "@/translation/translation.service";
import { CurrentUser } from "@/user/decorators/currentUser.decorator";
import { UserService } from "@/user/service/user.service";
import { User } from "@/user/user.entity";

@UseGuards(JwtAuthGuard, GameGuard)
@ApiTags('rating')
@ApiParam({ name: 'gameId', description: 'ID of game', required: true })
@ApiUnauthorizedResponse()
@ApiNotFoundResponse()
@Controller('/games/:gameId/rating')
export class RatingController {

  constructor(private ratingService: RatingService, private readonly usersService: UserService, private readonly translationsService: TranslationService, private readonly gameService: GameService) { }

  @Get("")
  @ApiOperation({ summary: 'Returns all game\'s rating' })
  @ApiOkResponse({ type: Rating, isArray: true })
  async getAllRating(@GameRequest() game: Game): Promise<Rating[]> {
    return this.ratingService.getAllRating(game.id);
  }

  @Get("/:ratingId")
  @UseGuards(RatingGuard)
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Return a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiBadRequestResponse()
  getRating(@RatingRequest() rating: Rating): Rating {
    return rating;
  }

  @Post("")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: "Create a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiInternalServerErrorResponse()
  @ApiConflictResponse()
  async createRating(@CurrentUser() user: User, @GameRequest() game: Game, @Body() body: RatingDto): Promise<Rating> {
    const rating = await this.ratingService.create(game.id, user.id, body);
    if (!rating) {
      throw new HttpException(await this.translationsService.translate("error.RATING_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return rating;
  }

  @Put("/:ratingId")
  @UseGuards(RatingGuard)
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Update a rating" })
  @ApiOkResponse({ type: Rating })
  async updateRating(@CurrentUser() user: User, @GameRequest() game: Game, @RatingRequest() rating: Rating, @Body() body: RatingUpdatedDto): Promise<Rating> {
    await this.ratingService.update(rating.id, body);
    const ratingUpdated = await this.ratingService.getRating(game.id, user.id);
    if (!ratingUpdated) {
      throw new HttpException(await this.translationsService.translate("error.RATING_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return ratingUpdated;
  }
  
  @Delete("/:ratingId")
  @UseGuards(RatingGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Update a rating" })
  @ApiOkResponse({ type: Rating })
  async deleteRating(@GameRequest() game: Game, @RatingRequest() rating: Rating): Promise<void> {
    return this.ratingService.delete(game.id, rating.id);
  }
}