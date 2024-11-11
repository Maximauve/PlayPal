import { Body, Controller, Delete, Get, HttpException, HttpStatus, ParseFilePipeBuilder, Post, Put, UploadedFile, UseGuards } from '@nestjs/common';
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
import { Express } from "express";

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GameRequest } from '@/game/decorators/game.decorator';
import { GameDto } from '@/game/dto/game.dto';
import { GameUpdatedDto } from '@/game/dto/gameUpdated.dto';
import { Game } from "@/game/game.entity";
import { GameGuard } from '@/game/guards/game.guard';
import { GameService } from "@/game/service/game.service";
import { TranslationService } from '@/translation/translation.service';

@UseGuards(JwtAuthGuard)
@ApiTags('games')
@ApiUnauthorizedResponse()
@Controller('games')
export class GameController {
  constructor(private readonly gamesService: GameService, private readonly translationsService: TranslationService) { }

  @Get('')
  @ApiOperation({ summary: "Get all games" })
  @ApiOkResponse({ type: Game, isArray: true })
  async getAll() {
    return this.gamesService.getAll();
  }

  @Get('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: "Get one game" })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse()
  getOneGame(@GameRequest() game: Game): Game {
    return game;
  }

  @Post('')
  @ApiOperation({ summary: "Create a game" })
  @ApiOkResponse({ type: Game })
  @ApiInternalServerErrorResponse()
  async create(@Body() body: GameDto, 
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: false,
        }),
    ) file?: Express.Multer.File): Promise<Game> {
    console.log(file);
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
  async update(@GameRequest() game: Game, @Body() body: GameUpdatedDto): Promise<Game> {
    await this.gamesService.update(game.id, body);
    const gameUpdated = await this.gamesService.findOneGame(game.id);
    if (!gameUpdated) {
      throw new HttpException(await this.translationsService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return gameUpdated;
  }

  @Delete('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async delete(@GameRequest() game: Game): Promise<void> {
    return this.gamesService.delete(game.id);
  }
}
