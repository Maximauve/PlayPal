import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GameGuard } from '@/game/guards/game.guard';
import { TranslationService } from '@/translation/translation.service';
import { CurrentUser } from '@/user/decorators/user.docarator';
import { User } from '@/user/user.entity';
import { WishDto } from '@/wish/dto/wish.dto';
import { WishGuard } from '@/wish/guards/wish.guard';
import { WishService } from '@/wish/service/wish.service';
import { Wish } from '@/wish/wish.entity';


@UseGuards(JwtAuthGuard, GameGuard)
@ApiTags('wish')
@Controller('games/:gameId/wish')
export class WishController {

  constructor(private readonly translationsService: TranslationService, private wishlistService: WishService) { }

  @Get('')
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })  
  @ApiOperation({ summary: "Get all wishes of a game" })
  @ApiOkResponse({ type: Wish, isArray: true })
  @ApiUnauthorizedResponse()
  async getAllWishes(@Param('gameId') gameId: string): Promise<Wish[]> {
    return this.wishlistService.getAllWishesForGame(gameId);
  }


  @Get('/:wishId')
  @UseGuards(WishGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'wishId', description: 'ID of wish', required: true })
  @ApiOperation({ summary: "Return a wish" })
  @ApiOkResponse({ type: Wish })
  @ApiUnauthorizedResponse()
  async getWish(@Param('wishId') wishId: string): Promise<Wish> {
    const wish = await this.wishlistService.getWish(wishId);
    if (!wish) {
      throw new HttpException(await this.translationsService.translate("error.WISH_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return wish;
  }

  @UsePipes(ValidationPipe)
  @Post('')
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: "Create a wish" })  
  @ApiOkResponse({ type: Wish })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiConflictResponse()
  @ApiNotFoundResponse()
  async createWish(@Param('gameId') gameId: string, @CurrentUser() user: User, @Body() wishDto: WishDto): Promise<Wish> {
    const wish = await this.wishlistService.create(user.id, gameId, wishDto);
    if (!wish) {
      throw new HttpException(await this.translationsService.translate("error.WISH_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return wish;
  }

  @UsePipes(ValidationPipe)
  @Put('/:wishId')
  @UseGuards(WishGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'wishId', description: 'ID of wish', required: true })
  @ApiOperation({ summary: "Update a wish" })
  @ApiOkResponse({ type: Wish })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiNotFoundResponse()
  async updateWish(@Param('wishId') wishId: string, @Body() wishDto: WishDto): Promise<Wish> {
    await this.wishlistService.updateWish(wishId, wishDto);
    const wish = await this.wishlistService.getWish(wishId);
    if (!wish) {
      throw new HttpException(await this.translationsService.translate("error.WISH_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return wish;
  }

  @Delete('/:wishId')
  @UseGuards(WishGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'wishId', description: 'ID of wish', required: true })
  @ApiOperation({ summary: "Delete a wish" })
  @ApiOkResponse({ type: Wish })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiNotFoundResponse()
  async deleteWish(@Param('wishId') wishId: string): Promise<void> {
    return this.wishlistService.deleteWish(wishId);
  }
}