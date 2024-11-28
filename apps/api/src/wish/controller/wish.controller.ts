import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { User, Wish } from '@playpal/schemas';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { GameGuard } from '@/game/guards/game.guard';
import { TranslationService } from '@/translation/translation.service';
import { CurrentUser } from '@/user/decorators/currentUser.decorator';
import { WishRequest } from '@/wish/decorators/wish.decorator';
import { WishDto } from '@/wish/dto/wish.dto';
import { WishGuard } from '@/wish/guards/wish.guard';
import { WishService } from '@/wish/service/wish.service';


@UseGuards(JwtAuthGuard, GameGuard)
@ApiTags('wish')
@Controller('games/:gameId/wish')
export class WishController {

  constructor(private readonly translationsService: TranslationService, private wishlistService: WishService) { }

  @Get('')
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: "Get all wishes of a game" })
  @ApiBadRequestResponse({ description: "UUID are invalid" })
  @ApiOkResponse({ description: "Wishes found successfully", type: Wish, isArray: true })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  async getAllWishes(@WishRequest() wish : Wish): Promise<Wish[]> {
    return this.wishlistService.getAllWishesForGame(wish.game.id);  
  }


  @Get('/:wishId')
  @UseGuards(WishGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'wishId', description: 'ID of wish', required: true })
  @ApiOperation({ summary: "Return a wish" })
  @ApiBadRequestResponse({ description: "UUID are invalid" })
  @ApiOkResponse({ description: "Wish found successfully", type: Wish })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  getWish(@WishRequest() wish: Wish): Wish {
    return wish;
  }

  @UsePipes(ValidationPipe)
  @Post('')
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: "Create a wish" })
  @ApiCreatedResponse({ description: "Wish created successfully", type: Wish })
  @ApiUnauthorizedResponse({ description: 'User not authenticated' })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while creating the wish" })
  @ApiConflictResponse({ description: "Wish already exists" })
  @ApiNotFoundResponse({ description: "Game or user not found" })
  async createWish(@Body() wishDto: WishDto, @CurrentUser() user: User): Promise<Wish> {
    const wish = await this.wishlistService.create( wishDto, user.id);
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
  @ApiCreatedResponse({ description: "The wish has been successfully updated", type: Wish })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while updating the wish" })
  @ApiNotFoundResponse({ description: "Game or user not found" })
  async updateWish(@WishRequest() wish: Wish, @Body() wishDto: WishDto): Promise<Wish> {
    await this.wishlistService.updateWish(wish.id, wishDto);
    const wishUpdated = await this.wishlistService.getWish(wish.id);
    if (!wishUpdated) {
      throw new HttpException(await this.translationsService.translate("error.WISH_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return wishUpdated;
  }

  @Delete('/:wishId')
  @UseGuards(WishGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'wishId', description: 'ID of wish', required: true })
  @ApiOperation({ summary: "Delete a wish" })
  @ApiOkResponse({ description: "Wish deleted successfully" })
  @ApiUnauthorizedResponse({ description: "User not connected" })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while deleting the wish" })
  @ApiNotFoundResponse({ description: "Wish not found" })
  async deleteWish(@WishRequest() wish: Wish): Promise<void> {
    return this.wishlistService.deleteWish(wish.id);
  }
}
