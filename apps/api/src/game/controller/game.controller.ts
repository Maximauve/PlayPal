<<<<<<< HEAD
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
=======
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
>>>>>>> db782ed (feat(api/games): WIP add games crud)
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

<<<<<<< HEAD
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
=======
import { GameDto } from '@/game/dto/game.dto';
import { Game } from "@/game/game.entity";
import { GameService } from "@/game/service/game.service";
import { TranslationService } from '@/translation/translation.service';
import { UserService } from '@/user/service/user.service';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gamesService: GameService, private usersService: UserService, private readonly translationsService: TranslationService) { }

  @Get("/")
  @ApiOperation({ summary: "Get all games" })
  @ApiOkResponse({ type: Game, isArray: true })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
>>>>>>> db782ed (feat(api/games): WIP add games crud)
  async getAll() {
    return this.gamesService.getAll();
  }

<<<<<<< HEAD
  @Get('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: "Get one game" })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async getOneGame(@Param('gameId') gameId: string): Promise<Game> {
    const game: Game | null = await this.gamesService.findOneGame(gameId);
=======
  @Get('/:id')
  @ApiOperation({ summary: "Get one game" })
  @ApiParam({ name: 'id', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse({ description: "Game not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getOneGame(@Param('id') id: string): Promise<Game> {
    const game: Game | null = await this.gamesService.findOneGame(id);
>>>>>>> db782ed (feat(api/games): WIP add games crud)
    if (!game) {
      throw new HttpException(await this.translationsService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return game;
  }

<<<<<<< HEAD
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
=======

  @Put('/:id')
  @ApiOperation({ summary: "Update a game" })
  @ApiParam({ name: 'id', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse({ description: "Game not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async update(@Req() request: Request, @Param('id') id: string, @Body() body: GameDto): Promise<Game> {
    // const me = await this.usersService.getUserConnected(request); TO UNCOMMENT AFTER MERGE
    // if (!me) {
    //   throw new UnauthorizedException();
    // }
    await this.gamesService.update(id, body);
    const game = await this.gamesService.findOneGame(id);
>>>>>>> db782ed (feat(api/games): WIP add games crud)
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return game;
  }

<<<<<<< HEAD
  @Delete('/:gameId')
  @UseGuards(GameGuard)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'gameId', description: 'Game id', required: true })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async delete(@Param('gameId') gameId: string): Promise<void> {
    return this.gamesService.delete(gameId);
=======
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'id', description: 'ID of user', required: true })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async delete(@Req() request: Request, @Param('id') id: string): Promise<void> {
    // const me = await this.usersService.getUserConnected(request); TO UNCOMMENT AFTER MERGE
    // if (!me) {
    //   throw new UnauthorizedException();
    // }
    return this.gamesService.delete(id);
>>>>>>> db782ed (feat(api/games): WIP add games crud)
  }
}