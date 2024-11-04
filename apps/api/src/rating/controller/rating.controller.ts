import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request } from "express";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameService } from "@/game/service/game.service";
import { RatingDto } from "@/rating/dto/rating.dto";
import { RatingUpdatedDto } from "@/rating/dto/ratingUpdated.dto";
import { Rating } from "@/rating/rating.entity";
import { RatingService } from "@/rating/service/rating.service";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";
import { uuidRegex } from "@/utils/regex.variable";

@UseGuards(JwtAuthGuard)
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
  async getAllRating(@Req() request: Request, @Param('gameId') gameId: string): Promise<Rating[]> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return this.ratingService.getAllRating(gameId);
  }

  @Get("/:ratingId")
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
    if (!uuidRegex.test(gameId) || !uuidRegex.test(ratingId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
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
  async createRating(@Req() request: Request, @Param('gameId') gameId: string, @Body() body: RatingDto): Promise<Rating> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const rating = await this.ratingService.create(gameId, me.id, body);
    if (!rating) {
      throw new HttpException(await this.translationsService.translate("error.RATING_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return rating;
  }

  @Put("/:ratingId")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Update a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async updateRating(@Req() request: Request, @Param('gameId') gameId: string, @Param('ratingId') ratingId: string, @Body() body: RatingUpdatedDto): Promise<Rating> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(ratingId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    await this.ratingService.update(gameId, me.id, ratingId, body);
    const rating = await this.ratingService.findOneRating(gameId, me.id);
    if (!rating) {
      throw new HttpException(await this.translationsService.translate("error.RATING_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return rating;
  }
  
  @Delete("/:ratingId")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'ratingId', description: 'ID of rating', required: true })
  @ApiOperation({ summary: "Update a rating" })
  @ApiOkResponse({ type: Rating })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async deleteRating(@Req() request: Request, @Param('gameId') gameId: string, @Param('ratingId') ratingId: string): Promise<void> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(ratingId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return this.ratingService.delete(gameId, ratingId);
  }
}