import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameRequest } from "@/game/decorators/game.decorator";
import { Game } from "@/game/game.entity";
import { GameGuard } from "@/game/guards/game.guard";
import { GameService } from "@/game/service/game.service";
import { ProductRequest } from "@/product/decorators/product.decorator";
import { AssignDto } from "@/product/dto/assign.dto";
import { ProductDto } from "@/product/dto/product.dto";
import { ProductUpdatedDto } from "@/product/dto/productUpdated.dto";
import { ProductGuard } from "@/product/guards/product.guard";
import { Product } from "@/product/product.entity";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { CurrentUser } from "@/user/decorators/currentUser.decorator";
import { UserService } from "@/user/service/user.service";
import { User } from "@/user/user.entity";

@UseGuards(JwtAuthGuard, GameGuard)
@ApiTags('product')
@ApiParam({ name: 'gameId', description: 'ID of game', required: true })
@ApiUnauthorizedResponse()
@ApiNotFoundResponse()
@Controller('games/:gameId/product')
export class ProductController {
  constructor(private readonly usersService: UserService, private readonly gameService: GameService, private readonly translationsService: TranslationService, private readonly productService: ProductService) { }

  @Get('')
  @ApiOperation({ summary: "Get all product of a game" })
  @ApiOkResponse({ type: Product, isArray: true })
  async getAllProduct(@GameRequest() game: Game): Promise<Product[]> {
    return this.productService.getAllProduct(game.id);
  }

  @Get("/:productId")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Return a product" })
  @ApiOkResponse({ type: Product })
  @ApiBadRequestResponse()
  getProduct(@ProductRequest() product: Product): Product {
    return product;
  }

  @UsePipes(ValidationPipe)
  @Post("")
  @ApiOperation({ summary: "Create a product" })
  @ApiOkResponse({ type: Product })
  @ApiInternalServerErrorResponse()
  @ApiConflictResponse()
  async createProduct(@CurrentUser() user: User, @GameRequest() game: Game, @Body() body: ProductDto): Promise<Product> {
    const newBody = {
      state: body.state,
      available: false
    };
    const product = await this.productService.create(game.id, user.id, newBody);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return product;
  }

  @UsePipes(ValidationPipe)
  @Post("/:productId/assign")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Assign a product to a user" })
  @ApiOkResponse({ type: Product })
  @ApiBadRequestResponse()
  async assignProduct(@GameRequest() game: Game, @ProductRequest() product: Product, @Body() body: AssignDto): Promise<Product> {
    const user = await this.usersService.findOneUser(body.userId);
    if (!user) {
      throw new HttpException(await this.translationsService.translate("error.USER_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const productAssign = await this.productService.assign(game.id, product.id, user);
    if (!productAssign) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return productAssign;
  }

  @Post("/:productId/unassign")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Unassign a product to a user" })
  @ApiOkResponse({ type: Product })
  @ApiBadRequestResponse()
  async unassignProduct(@GameRequest() game: Game, @ProductRequest() product: Product): Promise<Product> {
    const productUpdated = await this.productService.unassign(game.id, product.id);
    if (!productUpdated) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return productUpdated;
  }


  @UsePipes(ValidationPipe)
  @Put("/:productId")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Update a product" })
  @ApiOkResponse({ type: Product })
  @ApiBadRequestResponse()
  async updateProduct(@GameRequest() game: Game, @ProductRequest() product: Product, @Body() body: ProductUpdatedDto): Promise<Product> {
    await this.productService.update(product.id, body);
    const productUpdated = await this.productService.getProduct(game.id, product.id);
    if (!productUpdated) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return productUpdated;
  }

  @Delete("/:productId")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Delete a product" })
  @ApiOkResponse({ type: Product })
  @ApiBadRequestResponse()
  async deleteProduct(@GameRequest() game: Game, @ProductRequest() product: Product): Promise<void> {
    return this.productService.delete(game.id, product.id);
  }
}