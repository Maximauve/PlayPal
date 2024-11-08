import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request } from "express";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameService } from "@/game/service/game.service";
import { AssignDto } from "@/product/dto/assign.dto";
import { ProductDto } from "@/product/dto/product.dto";
import { ProductUpdatedDto } from "@/product/dto/productUpdated.dto";
import { Product } from "@/product/product.entity";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";
import { uuidRegex } from "@/utils/regex.variable";

@UseGuards(JwtAuthGuard)
@ApiTags('product')
@Controller('game/:gameId/product')
export class ProductController {
  constructor(private readonly usersService: UserService, private readonly gameService: GameService, private readonly translationsService: TranslationService, private readonly productService: ProductService) { }

  @Get('')
  @ApiOperation({ summary: "Get all product of a game" })
  @ApiOkResponse({ type: Product, isArray: true })
  @ApiUnauthorizedResponse()
  async getAllProduct(@Req() request: Request, @Param('gameId') gameId: string): Promise<Product[]> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return this.productService.getAllProduct(gameId);
  }

  @Get("/:productId")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Return a product" })
  @ApiOkResponse({ type: Product })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getProduct(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string): Promise<Product> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(productId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const product = await this.productService.getProduct(gameId, productId);
    if (!product) {
      throw new HttpException(await this.translationsService.translate('error.PRODUCT_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @UsePipes(ValidationPipe)
  @Post("")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: "Create a product" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiConflictResponse()
  @ApiNotFoundResponse()
  async createProduct(@Req() request: Request, @Param('gameId') gameId: string, @Body() body: ProductDto): Promise<Product> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const product = await this.productService.create(gameId, me.id, body);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return product;
  }

  @UsePipes(ValidationPipe)
  @Post("/:productId/assign")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Assign a product to a user" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async assignProduct(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string, @Body() body: AssignDto): Promise<Product> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(productId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const user = await this.usersService.findOneUser(body.userId);
    if (!user) {
      throw new HttpException(await this.translationsService.translate("error.USER_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const product = await this.productService.assign(gameId, productId, user);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Post("/:productId/unassign")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Unassign a product to a user" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async unassignProduct(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string): Promise<Product> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(productId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const product = await this.productService.unassign(gameId, productId);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return product;
  }


  @UsePipes(ValidationPipe)
  @Put("/:productId")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Update a product" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async updateProduct(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string, @Body() body: ProductUpdatedDto): Promise<Product> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(productId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    await this.productService.update(productId, body);
    const product = await this.productService.getProduct(gameId, me.id);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Delete("/:productId")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Update a product" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async deleteProduct(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string): Promise<void> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(productId)) {
      throw new HttpException(await this.translationsService.translate('error.ID_INVALID'), HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findOneGame(gameId);
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return this.productService.delete(gameId, productId);
  }
}