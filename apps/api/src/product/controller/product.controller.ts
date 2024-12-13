import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Loan, Product } from "@playpal/schemas";

import { AdminGuard } from "@/auth/guards/admin.guard";
import { LoanService } from "@/loan/service/loan.service";
import { ProductRequest } from "@/product/decorators/product.decorator";
import { AssignDto } from "@/product/dto/assign.dto";
import { ProductDto } from "@/product/dto/product.dto";
import { ProductUpdatedDto } from "@/product/dto/productUpdated.dto";
import { ProductGuard } from "@/product/guards/product.guard";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";

@UseGuards(AdminGuard)
@ApiTags('product')
@ApiUnauthorizedResponse({ description: "User not connected" })
@ApiForbiddenResponse({ description: 'User is not admin' })
@Controller('product')
export class ProductController {
  constructor(
    private readonly usersService: UserService,
    private readonly translationsService: TranslationService,
    private readonly productService: ProductService,
    private readonly loanService: LoanService,
  ) { }

  @Get('')
  @ApiOperation({ summary: "Get all products" })
  @ApiOkResponse({ description: "Products found successfully", type: Product, isArray: true })
  async getAllProduct(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get("/:productId")
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Return a product" })
  @ApiOkResponse({ description: "Product found successfully", type: Product })
  @ApiNotFoundResponse({ description: "Product is not found" })
  getProduct(@ProductRequest() product: Product): Product {
    return product;
  }

  @Post("")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Create a product" })
  @ApiCreatedResponse({ description: "Product created successfully", type: Product })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while creating the product" })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  async createProduct(@Body() body: ProductDto): Promise<Product> {
    const newBody = {
      ...body,
      available: true
    };
    const product = await this.productService.create(newBody);
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return product;
  }

  @Post("/:productId/assign")
  @UsePipes(ValidationPipe)
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Assign a product to a user" })
  @ApiOkResponse({ description: "Product is correctly assigned", type: Product })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "Product or user is not found" })
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
  @ApiNotFoundResponse({ description: "Product is not found" })
  async unassignProduct(@ProductRequest() product: Product): Promise<Product> {
    const productUpdated = await this.productService.unassign(product);
    if (!productUpdated) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return productUpdated;
  }

  @Put("/:productId")
  @UsePipes(ValidationPipe)
  @UseGuards(ProductGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Update a product" })
  @ApiOkResponse({ description: "Product updated successfully", type: Product })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  @ApiNotFoundResponse({ description: "Product is not found" })
  async updateProduct(@ProductRequest() product: Product, @Body() body: ProductUpdatedDto): Promise<Product> {
    await this.productService.update(product.id, body);
    const productUpdated = await this.productService.getProduct(product.id);
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
  async deleteProduct(@ProductRequest() product: Product): Promise<void> {
    await this.productService.delete(product.id);
  }

  @Get('/:productId/loans')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: 'Get all loans associated to the given product' })
  @ApiOkResponse({ description: 'Loans found successfully', type: Loan, isArray: true })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'User is not connected' })
  @ApiForbiddenResponse({ description: 'User is not admin' })
  async getLoansByProduct(@Param("productId") productId: string): Promise<Loan[]> {
    return this.loanService.getAllByProduct(productId); 
  }
}
