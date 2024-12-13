import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
  ApiResetContentResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { Game, Product, User } from "@playpal/schemas";
import { Express } from 'express';

import { AdminGuard } from '@/auth/guards/admin.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { FileUploadService } from '@/files/files.service';
import { ParseFilePipeDocument } from '@/files/files.validator';
import { GameRequest } from '@/game/decorators/game.decorator';
import { GameDto } from '@/game/dto/game.dto';
import { GameUpdatedDto } from '@/game/dto/gameUpdated.dto';
import { GameGuard } from '@/game/guards/game.guard';
import { GameService } from "@/game/service/game.service";
import { ProductService } from '@/product/service/product.service';
import { RedisService } from '@/redis/service/redis.service';
import { TranslationService } from '@/translation/translation.service';
import { CurrentUser } from '@/user/decorators/currentUser.decorator';


@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(
    private readonly gamesService: GameService,
    private readonly translationsService: TranslationService,
    private readonly fileUploadService: FileUploadService,
    private readonly productService: ProductService,
    private readonly redisService: RedisService,
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
  @ApiOperation({ summary: "Get the most liked games" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiOkResponse({ description: "Games found successfully", type: Game, isArray: true })
  async getRecommendations(@Query('limit') limit = 10) {
    const data = await this.gamesService.getRecommendations(limit);
    return data;
  }

  @Get('/last')
  @ApiOperation({ summary: "Get three last games" })
  @ApiOkResponse({ description: "Game found successfully", type: Game, isArray: true })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiNotFoundResponse({ description: "Game not found" })
  getThreeLastGame() {
    return this.gamesService.getThreeLastGames();
  }

  @Get('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: "Get one game" })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ description: "Game found successfully" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiNotFoundResponse({ description: "Game not found" })
  @ApiBadRequestResponse({ description: "UUID is invalid" })
  async getOneGame(@GameRequest() game: Game): Promise<Game | null> {
    return this.gamesService.findOneGame(game.id);
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
      body = { ...body, image: `${process.env.VITE_API_BASE_URL}/files/${fileName}` };
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
      const objectKey = game.image.split('/').pop();
      if (!objectKey) {
        throw new HttpException('Invalid image URL', HttpStatus.BAD_REQUEST);
      }

      await this.fileUploadService.deleteFile(objectKey);
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

  @Post('/waiting/:gameId')
  @UseGuards(GameGuard)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Subscribe for availability of a game' })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ description: 'User has been successfully put on the waiting list' })
  @ApiResetContentResponse({ description: 'A game is already available to rent' })
  @ApiNotFoundResponse({ description: "Game not found" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiBadRequestResponse({ description: "UUID is invalid" })
  @HttpCode(HttpStatus.OK)
  async subscribe(@GameRequest() game: Game, @CurrentUser() user: User)  {
    if (await this.gamesService.hasProductAvailable(game.id)) {
      throw new HttpException('', HttpStatus.RESET_CONTENT);
    }

    const products = await this.productService.getAllProductsByGameId(game.id);
    if ( products.some(product => product.user?.id === user.id)) {
      throw new ForbiddenException(await this.translationsService.translate('error.ALREADY_RENTING_GAME'));
    }

    try {
      if (await this.redisService.exists(`game-waiting-${game.id}`)) {
        const userIds =  await this.redisService.lgetall(`game-waiting-${game.id}`);
        if (userIds.includes(user.id)) {
          throw new ForbiddenException(await this.translationsService.translate('error.ALREADY_ON_WAITLIST'));
        }
        this.redisService.push(`game-waiting-${game.id}`, user.id);
      } else {
        this.redisService.push(`game-waiting-${game.id}`, user.id);
      }
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(await this.translationsService.translate('error.SOMETHING_WENT_WRONG'));
    }

    return;
  }
}
