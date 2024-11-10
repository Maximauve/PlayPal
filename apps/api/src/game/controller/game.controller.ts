import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GameDto } from '@/game/dto/game.dto';
import { GameUpdatedDto } from '@/game/dto/gameUpdated.dto';
import { Game } from "@/game/game.entity";
import { GameGuard } from '@/game/guards/game.guard';
import { GameService } from "@/game/service/game.service";
import { TranslationService } from '@/translation/translation.service';

@UseGuards(JwtAuthGuard)
@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gamesService: GameService, private readonly translationsService: TranslationService) { }

  @Get('')
  @ApiOperation({ summary: "Get all games" })
  @ApiOkResponse({ type: Game, isArray: true })
  @ApiUnauthorizedResponse()
  async getAll() {
    return this.gamesService.getAll();
  }

  @Get('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: "Get one game" })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async getOneGame(@Param('gameId') gameId: string): Promise<Game> {
    const game: Game | null = await this.gamesService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return game;
  }

  @Post('')
  @ApiOperation({ summary: "Create a game" })
  @ApiOkResponse({ type: Game })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  async create(@Body() body: GameDto): Promise<Game> {
    const game = await this.gamesService.create(body);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return game;
  }

  @Put('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: "Update a game" })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async update(@Param('gameId') gameId: string, @Body() body: GameUpdatedDto): Promise<Game> {
    await this.gamesService.update(gameId, body);
    const game = await this.gamesService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return game;
  }

  @Delete('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async delete(@Param('gameId') gameId: string): Promise<void> {
    return this.gamesService.delete(gameId);
  }
}