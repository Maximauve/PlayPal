import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
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
import { Request } from 'express';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GameDto } from '@/game/dto/game.dto';
import { GameUpdatedDto } from '@/game/dto/gameUpdated.dto';
import { Game } from "@/game/game.entity";
import { GameService } from "@/game/service/game.service";
import { TranslationService } from '@/translation/translation.service';
import { UserService } from '@/user/service/user.service';
import { uuidRegex } from '@/utils/regex.variable';

@UseGuards(JwtAuthGuard)
@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gamesService: GameService, private usersService: UserService, private readonly translationsService: TranslationService) { }

  @Get('')
  @ApiOperation({ summary: "Get all games" })
  @ApiOkResponse({ type: Game, isArray: true })
  @ApiUnauthorizedResponse()
  async getAll() {
    return this.gamesService.getAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: "Get one game" })
  @ApiParam({ name: 'id', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async getOneGame(@Req() request: Request, @Param('id') id: string): Promise<Game> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(id)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game: Game | null = await this.gamesService.findOneGame(id);
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
  async create(@Req() request: Request, @Body() body: GameDto): Promise<Game> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    const game = await this.gamesService.create(body);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return game;
  }

  @Put('/:id')
  @ApiOperation({ summary: "Update a game" })
  @ApiParam({ name: 'id', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async update(@Req() request: Request, @Param('id') id: string, @Body() body: GameUpdatedDto): Promise<Game> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(id)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    await this.gamesService.update(id, body);
    const game = await this.gamesService.findOneGame(id);
    if (!game) {
      throw new HttpException(await this.translationsService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return game;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'id', description: 'Game id', required: true })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  async delete(@Req() request: Request, @Param('id') id: string): Promise<void> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(id)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    return this.gamesService.delete(id);
  }
}