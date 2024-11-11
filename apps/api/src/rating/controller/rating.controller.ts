import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameGuard } from "@/game/guards/game.guard";
import { GameService } from "@/game/service/game.service";
import { RatingDto } from "@/rating/dto/rating.dto";
import { RatingUpdatedDto } from "@/rating/dto/ratingUpdated.dto";
import { RatingGuard } from "@/rating/guards/rating.guard";
import { Rating } from "@/rating/rating.entity";
import { RatingService } from "@/rating/service/rating.service";
import { TranslationService } from "@/translation/translation.service";
import { CurrentUser } from "@/user/decorators/user.docarator";
import { UserService } from "@/user/service/user.service";
import { User } from "@/user/user.entity";

@UseGuards(JwtAuthGuard, GameGuard)
@ApiTags('rating')
@Controller('/games/:gameId/rating')
export class RatingController {

  constructor(private ratingService: RatingService, private readonly usersService: UserService, private readonly translationsService: TranslationService, private readonly gameService: GameService) { }

  @Get("")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: 'Returns all game\'s rating' })
  @ApiOkResponse({ type: Rating, isArray: true })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getAllRating(@Param('gameId') gameId: string): Promise<Rating[]> {
    return this.ratingService.getAllRating(gameId);
  }

  @Get("/:ratingId")
  @UseGuards(RatingGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Return a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getRating(@Param('gameId') gameId: string, @Param('ratingId') ratingId: string): Promise<Rating> {
    const rating = await this.ratingService.getRating(gameId, ratingId);
    if (!rating) {
      throw new HttpException(await this.translationsService.translate('error.RATING_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return rating;
  }

  @Post("")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: "Create a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiConflictResponse()
  @ApiNotFoundResponse()
  async createRating(@CurrentUser() user: User, @Param('gameId') gameId: string, @Body() body: RatingDto): Promise<Rating> {
    const rating = await this.ratingService.create(gameId, user.id, body);
    if (!rating) {
      throw new HttpException(await this.translationsService.translate("error.RATING_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return rating;
  }

  @Put("/:ratingId")
  @UseGuards(RatingGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Update a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async updateRating(@CurrentUser() user: User, @Param('gameId') gameId: string, @Param('ratingId') ratingId: string, @Body() body: RatingUpdatedDto): Promise<Rating> {
    await this.ratingService.update(ratingId, body);
    const rating = await this.ratingService.getRating(gameId, user.id);
    if (!rating) {
      throw new HttpException(await this.translationsService.translate("error.RATING_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return rating;
  }
  
  @Delete("/:ratingId")
  @UseGuards(RatingGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Update a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async deleteRating(@Param('gameId') gameId: string, @Param('ratingId') ratingId: string): Promise<void> {
    return this.ratingService.delete(gameId, ratingId);
  }
}