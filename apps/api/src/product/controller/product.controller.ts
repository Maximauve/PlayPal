import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameGuard } from "@/game/guards/game.guard";
import { GameService } from "@/game/service/game.service";
import { AssignDto } from "@/product/dto/assign.dto";
import { ProductDto } from "@/product/dto/product.dto";
import { ProductUpdatedDto } from "@/product/dto/productUpdated.dto";
import { ProductGuard } from "@/product/guards/product.guard";
import { Product } from "@/product/product.entity";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { CurrentUser } from "@/user/decorators/user.docarator";
import { UserService } from "@/user/service/user.service";
import { User } from "@/user/user.entity";

@UseGuards(JwtAuthGuard, GameGuard)
@ApiTags('product')
@Controller('games/:gameId/product')
export class ProductController {
  constructor(private readonly usersService: UserService, private readonly gameService: GameService, private readonly translationsService: TranslationService, private readonly productService: ProductService) { }

  @Get('')
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiOperation({ summary: "Get all product of a game" })
  @ApiOkResponse({ type: Product, isArray: true })
  @ApiUnauthorizedResponse()
  async getAllProduct(@Param('gameId') gameId: string): Promise<Product[]> {
    return this.productService.getAllProduct(gameId);
  }

  @Get("/:productId")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Return a product" })
  @ApiOkResponse({ type: Product })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getProduct(@Param('gameId') gameId: string, @Param('productId') productId: string): Promise<Product> {
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
  async createProduct(@CurrentUser() user: User, @Param('gameId') gameId: string, @Body() body: ProductDto): Promise<Product> {
    const newBody = {
      state: body.state,
      available: false
    };
    const product = await this.productService.create(gameId, user.id, newBody);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return product;
  }

  @UsePipes(ValidationPipe)
  @Post("/:productId/assign")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Assign a product to a user" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async assignProduct(@Param('gameId') gameId: string, @Param('productId') productId: string, @Body() body: AssignDto): Promise<Product> {
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
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Unassign a product to a user" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async unassignProduct(@Param('gameId') gameId: string, @Param('productId') productId: string): Promise<Product> {
    const product = await this.productService.unassign(gameId, productId);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return product;
  }


  @UsePipes(ValidationPipe)
  @Put("/:productId")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Update a product" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async updateProduct(@Param('gameId') gameId: string, @Param('productId') productId: string, @Body() body: ProductUpdatedDto): Promise<Product> {
    await this.productService.update(productId, body);
    const product = await this.productService.getProduct(gameId, productId);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return product;
  }

  @Delete("/:productId")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Delete a product" })
  @ApiOkResponse({ type: Product })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async deleteProduct(@Param('gameId') gameId: string, @Param('productId') productId: string): Promise<void> {
    return this.productService.delete(gameId, productId);
  }
}