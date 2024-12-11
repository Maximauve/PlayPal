import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Game, Product } from "@playpal/schemas";
import { GameWithStats } from '@playpal/schemas/dist/src/game/game.stats';
import { Express } from 'express';

import { AdminGuard } from '@/auth/guards/admin.guard';
import { FileUploadService } from '@/files/files.service';
import { ParseFilePipeDocument } from '@/files/files.validator';
import { GameRequest } from '@/game/decorators/game.decorator';
import { GameDto } from '@/game/dto/game.dto';
import { GameUpdatedDto } from '@/game/dto/gameUpdated.dto';
import { GameGuard } from '@/game/guards/game.guard';
import { GameService } from "@/game/service/game.service";
import { ProductService } from '@/product/service/product.service';
import { TranslationService } from '@/translation/translation.service';


@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(
    private readonly gamesService: GameService,
    private readonly translationsService: TranslationService,
    private readonly fileUploadService: FileUploadService,
    private readonly productService: ProductService,
  ) { }

  @Get('')
  @ApiOperation({ summary: "Get all games" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiOkResponse({ description: "Games found successfully", type: Game, isArray: true })
  async getAll(@Query('tags') tags?: string[] | string, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search?: string) {
    const { data, total } = await this.gamesService.getAll(page, limit, tags, search);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  
  @Get('/recommendations')
  @ApiOperation({ summary: "Get all games" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiOkResponse({ description: "Games found successfully", type: Game, isArray: true })
  async getRecommendations(@Query('limit') limit = 10) {
    const data = await this.gamesService.getRecommendations(limit);
    return data;
  }

  @Get('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: "Get one game" })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ description: "Game found successfully", type: Game })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiNotFoundResponse({ description: "Game not found" })
  @ApiBadRequestResponse({ description: "UUID is invalid" })
  async getOneGame(@GameRequest() game: Game): Promise<GameWithStats> {
    const data = await this.gamesService.getGameWithStats(game);
    return data;
  }

  @Get('/:gameId/notes')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: "Get one game average note and the count of each possible note" })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ description: "Game found successfully", type: Game })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiNotFoundResponse({ description: "Game not found" })
  @ApiBadRequestResponse({ description: "UUID is invalid" })
  getOneGameNotes(@GameRequest() game: Game) {
    return this.gamesService.getGameNotes(game.id);
  }

  @Post('')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: "Create a game" })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'The game has been successfully created', type: Game })
  @ApiConflictResponse({ description: 'A game with the same name already exists' })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while creating the game" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiBadRequestResponse({ description: "Request body is invalid" })
  async create(@Body() body: GameDto, @UploadedFile(ParseFilePipeDocument) file?: Express.Multer.File): Promise<Game> {
    if (await this.gamesService.findOneName(body.name)) {
      throw new HttpException(await this.translationsService.translate("error.GAME_ALREADY_EXIST"), HttpStatus.CONFLICT);
    }
    if (file) {
      const fileName = await this.fileUploadService.uploadFile(file);
      body = { ...body, image: `${process.env.VITE_API_BASE_URL}/files/${fileName}` };
    }
    const game = await this.gamesService.create(body);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return game;
  }

  @Put('/:gameId')
  @UseGuards(AdminGuard)
  @UseGuards(GameGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: "Update a game" })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ description: "Game updated successfully", type: Game })
  @ApiNotFoundResponse({ description: "Game or tags not found" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiBadRequestResponse({ description: "Request body or UUID is invalid" })
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
  @UseGuards(AdminGuard)
  @UseGuards(GameGuard)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ description: "Game deleted successfully" })
  @ApiNotFoundResponse({ description: "Game not found" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiBadRequestResponse({ description: "UUID is invalid" })
  async delete(@GameRequest() game: Game): Promise<void> {
    if (game.image) {
      await this.fileUploadService.deleteFile(game.image);
    }
    await this.gamesService.delete(game.id);
  }

  @Get('/:gameId/products')
  @UseGuards(AdminGuard)
  @UseGuards(GameGuard)
  @ApiOperation({ summary: "Get all product of a game" })
  @ApiOkResponse({ description: "Products found successfully", type: Product, isArray: true })
  async getAllProduct(@Param("gameId") gameId: string): Promise<Product[]> {
    return this.productService.getAllProductsByGameId(gameId);
  }
}
