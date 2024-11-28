import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Game, Product, User } from "@playpal/schemas";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameRequest } from "@/game/decorators/game.decorator";
import { GameGuard } from "@/game/guards/game.guard";
import { ProductRequest } from "@/product/decorators/product.decorator";
import { AssignDto } from "@/product/dto/assign.dto";
import { ProductDto } from "@/product/dto/product.dto";
import { ProductUpdatedDto } from "@/product/dto/productUpdated.dto";
import { ProductGuard } from "@/product/guards/product.guard";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { CurrentUser } from "@/user/decorators/currentUser.decorator";
import { UserService } from "@/user/service/user.service";

@UseGuards(JwtAuthGuard, GameGuard)
@ApiTags('product')
@ApiParam({ name: 'gameId', description: 'ID of game', required: true })
@ApiNotFoundResponse({ description: "Game not found" })
@ApiBadRequestResponse({ description: "UUID are invalid" })
@ApiUnauthorizedResponse({ description: "User not connected" })
@Controller('games/:gameId/product')
export class ProductController {
  constructor(private readonly usersService: UserService, private readonly translationsService: TranslationService, private readonly productService: ProductService) { }

  @Get('')
  @ApiOperation({ summary: "Get all product of a game" })
  @ApiOkResponse({ description: "Products found successfully", type: Product, isArray: true })
  async getAllProduct(@GameRequest() game: Game): Promise<Product[]> {
    return this.productService.getAllProduct(game.id);
  }

  @Get("/:productId")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Return a product" })
  @ApiOkResponse({ description: "Product found successfully", type: Product })
  @ApiNotFoundResponse({ description: "Game or product is not found" })
  getProduct(@ProductRequest() product: Product): Product {
    return product;
  }

  @UsePipes(ValidationPipe)
  @Post("")
  @ApiOperation({ summary: "Create a product" })
  @ApiCreatedResponse({ description: "Product created successfully", type: Product })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while creating the product" })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "Game or user not found" })
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
  @ApiOkResponse({ description: "Product is correctly assigned", type: Product })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "Game, product or user is not found" })
  async assignProduct(@ProductRequest() product: Product, @Body() body: AssignDto): Promise<Product> {
    const user = await this.usersService.findOneUser(body.userId);
    if (!user) {
      throw new HttpException(await this.translationsService.translate("error.USER_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const productAssign = await this.productService.assign(product, user);
    if (!productAssign) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return productAssign;
  }

  @Post("/:productId/unassign")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Unassign a product to a user" })
  @ApiOkResponse({ description: "Product is correctly unassigned", type: Product })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "Game or product is not found" })
  async unassignProduct(@ProductRequest() product: Product): Promise<Product> {
    const productUpdated = await this.productService.unassign(product);
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
  @ApiOkResponse({ description: "Product updated successfully", type: Product })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "Game or product is not found" })
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
  @ApiOkResponse({ description: "Product deleted successfully" })
  @ApiNotFoundResponse({ description: "Game or product is not found" })
  async deleteProduct(@GameRequest() game: Game, @ProductRequest() product: Product): Promise<void> {
    await this.productService.delete(game.id, product.id);
  }
}
