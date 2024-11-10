<<<<<<< HEAD
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameGuard } from "@/game/guards/game.guard";
import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { LoanGuard } from "@/loan/guards/loan.guard";
import { Loan } from "@/loan/loan.entity";
import { LoanService } from "@/loan/service/loan.service";
import { ProductGuard } from "@/product/guards/product.guard";
import { Product } from "@/product/product.entity";
import { TranslationService } from "@/translation/translation.service";
import { CurrentUser } from "@/user/decorators/user.docarator";
import { User } from "@/user/user.entity";

@UseGuards(JwtAuthGuard, GameGuard, ProductGuard)
@ApiTags('loan')
@Controller('games/:gameId/product/:productId/loan')
export class LoanController {
  constructor(private readonly translationsService: TranslationService, private readonly loanService: LoanService) { }
=======
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request } from "express";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameService } from "@/game/service/game.service";
import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { Loan } from "@/loan/loan.entity";
import { LoanService } from "@/loan/service/loan.service";
import { Product } from "@/product/product.entity";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";
import { uuidRegex } from "@/utils/regex.variable";

@UseGuards(JwtAuthGuard)
@ApiTags('loan')
@Controller('games/:gameId/product/:productId/loan')
export class LoanController {
  constructor(private readonly usersService: UserService, private readonly gameService: GameService, private readonly translationsService: TranslationService, private readonly productService: ProductService, private readonly loanService: LoanService) { }
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)

  @Get('')
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Get all loan of a product" })
  @ApiOkResponse({ type: Product, isArray: true })
  @ApiUnauthorizedResponse()
<<<<<<< HEAD
  async getAllLoan(@Param('productId') productId: string): Promise<Loan[]> {
=======
  async getAllLoan(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string): Promise<Loan[]> {
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
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
    return this.loanService.getAllLoan(productId);
  }

  @Get("/:loanId")
<<<<<<< HEAD
  @UseGuards(LoanGuard)
=======
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Return a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
<<<<<<< HEAD
  async getLoan(@Param('productId') productId: string, @Param('loanId') loanId: string): Promise<Loan> {
=======
  async getLoan(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string, @Param('loanId') loanId: string): Promise<Loan> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(productId) || !uuidRegex.test(loanId)) {
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
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
    const loan = await this.loanService.getLoan(productId, loanId);
    if (!loan) {
      throw new HttpException(await this.translationsService.translate("error.LOAN_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return loan;
  }

  @UsePipes(ValidationPipe)
  @Post("")
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Create a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @ApiConflictResponse()
  @ApiNotFoundResponse()
<<<<<<< HEAD
  async createLoan(@CurrentUser() user: User, @Param('productId') productId: string, @Body() body: LoanDto): Promise<Loan> {
    const loan = await this.loanService.create(productId, user.id, body);
=======
  async createLoan(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string, @Body() body: LoanDto): Promise<Loan> {
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
    const loan = await this.loanService.create(productId, me.id, body);
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
    if (!loan) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return loan;
  }

  @UsePipes(ValidationPipe)
  @Put("/:loanId")
<<<<<<< HEAD
  @UseGuards(LoanGuard)
=======
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Update a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
<<<<<<< HEAD
  async updateLoan(@Param('productId') productId: string, @Param('loanId') loanId: string, @Body() body: LoanUpdatedDto): Promise<Loan> {
=======
  async updateLoan(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string, @Param('loanId') loanId: string, @Body() body: LoanUpdatedDto): Promise<Loan> {
    const me = await this.usersService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }
    if (!uuidRegex.test(gameId) || !uuidRegex.test(productId) || !uuidRegex.test(loanId)) {
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
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
    await this.loanService.update(loanId, body);
    const loan = await this.loanService.getLoan(productId, loanId);
    if (!loan) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return loan;
  }

  @Delete("/:loanId")
<<<<<<< HEAD
  @UseGuards(LoanGuard)
=======
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Delete a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
<<<<<<< HEAD
  async deleteLoan(@Param('productId') productId: string, @Param('loanId') loanId: string): Promise<void> {
=======
  async deleteLoan(@Req() request: Request, @Param('gameId') gameId: string, @Param('productId') productId: string, @Param('loanId') loanId: string): Promise<void> {
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
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
    return this.loanService.delete(productId, loanId);
  }
}