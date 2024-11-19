import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Express } from 'express';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { FileUploadService } from '@/files/files.service';
import { ParseFilePipeDocument } from '@/files/files.validator';
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
  constructor(private readonly gamesService: GameService, private readonly translationsService: TranslationService, private readonly fileUploadService: FileUploadService) { }

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
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: "Create a game" })
  @ApiOkResponse({ type: Game })
  @ApiInternalServerErrorResponse()
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  async create(@Body() body: GameDto, @UploadedFile(ParseFilePipeDocument) file?: Express.Multer.File): Promise<Game> {
    if (await this.gamesService.findOneName(body.name)) {
      throw new HttpException(await this.translationsService.translate("error.GAME_ALREADY_EXIST"), HttpStatus.CONFLICT);
    }
    if (file) {
      const fileName = await this.fileUploadService.uploadFile(file);
      body = { ...body, image: fileName };
    }
    const game = await this.gamesService.create(body);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return game;
  }

  @Put('/:gameId')
  @UseGuards(GameGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: "Update a game" })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse()
  async update(@GameRequest() game: Game, @Body() body: GameUpdatedDto, @UploadedFile(ParseFilePipeDocument) file?: Express.Multer.File): Promise<Game> {
    if (file) {
      const fileName = await this.fileUploadService.uploadFile(file);
      body = { ...body, image: fileName };
    }
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
    if (game.image) {
      await this.fileUploadService.deleteFile(game.image);
    }
    return this.gamesService.delete(game.id);
  }
}
