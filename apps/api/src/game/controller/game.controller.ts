import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Put, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

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
  async getAll() {
    return this.gamesService.getAll();
  }

  @Get('/:id')
  @ApiOperation({ summary: "Get one game" })
  @ApiParam({ name: 'id', description: 'Game id', required: true })
  @ApiOkResponse({ type: Game })
  @ApiNotFoundResponse({ description: "Game not found" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  async getOneGame(@Param('id') id: string): Promise<Game> {
    const game: Game | null = await this.gamesService.findOneGame(id);
    if (!game) {
      throw new HttpException(await this.translationsService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return game;
  }


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
    if (!game) {
      throw new HttpException(await this.translationsService.translate('error.GAME_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return game;
  }

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
  }
}