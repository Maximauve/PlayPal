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

  @Get('')
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiOperation({ summary: "Get all loan of a product" })
  @ApiOkResponse({ type: Product, isArray: true })
  @ApiUnauthorizedResponse()
  async getAllLoan(@Param('productId') productId: string): Promise<Loan[]> {
    return this.loanService.getAllLoan(productId);
  }

  @Get("/:loanId")
  @UseGuards(LoanGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Return a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getLoan(@Param('productId') productId: string, @Param('loanId') loanId: string): Promise<Loan> {
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
  async createLoan(@CurrentUser() user: User, @Param('productId') productId: string, @Body() body: LoanDto): Promise<Loan> {
    const loan = await this.loanService.create(productId, user.id, body);
    if (!loan) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return loan;
  }

  @UsePipes(ValidationPipe)
  @Put("/:loanId")
  @UseGuards(LoanGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Update a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async updateLoan(@Param('productId') productId: string, @Param('loanId') loanId: string, @Body() body: LoanUpdatedDto): Promise<Loan> {
    await this.loanService.update(loanId, body);
    const loan = await this.loanService.getLoan(productId, loanId);
    if (!loan) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return loan;
  }

  @Delete("/:loanId")
  @UseGuards(LoanGuard)
  @ApiParam({ name: 'gameId', description: 'ID of game', required: true })
  @ApiParam({ name: 'productId', description: 'ID of product', required: true })
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Delete a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  async deleteLoan(@Param('productId') productId: string, @Param('loanId') loanId: string): Promise<void> {
    return this.loanService.delete(productId, loanId);
  }
}