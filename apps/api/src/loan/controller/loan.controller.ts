import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameGuard } from "@/game/guards/game.guard";
import { LoanRequest } from "@/loan/decorators/loan.decorator";
import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { LoanGuard } from "@/loan/guards/loan.guard";
import { Loan } from "@/loan/loan.entity";
import { LoanService } from "@/loan/service/loan.service";
import { ProductRequest } from "@/product/decorators/product.decorator";
import { ProductGuard } from "@/product/guards/product.guard";
import { Product } from "@/product/product.entity";
import { TranslationService } from "@/translation/translation.service";
import { CurrentUser } from "@/user/decorators/currentUser.decorator";
import { User } from "@/user/user.entity";

@UseGuards(JwtAuthGuard, GameGuard, ProductGuard)
@ApiTags('loan')
@ApiParam({ name: 'gameId', description: 'ID of game', required: true })
@ApiParam({ name: 'productId', description: 'ID of product', required: true })
@ApiNotFoundResponse()
@ApiUnauthorizedResponse()
@Controller('games/:gameId/product/:productId/loan')
export class LoanController {
  constructor(private readonly translationsService: TranslationService, private readonly loanService: LoanService) { }

  @Get('')
  @ApiOperation({ summary: "Get all loan of a product" })
  @ApiOkResponse({ type: Product, isArray: true })
  async getAllLoan(@ProductRequest() product: Product): Promise<Loan[]> {
    return this.loanService.getAllLoan(product.id);
  }

  @Get("/:loanId")
  @UseGuards(LoanGuard)
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Return a loan" })
  @ApiOkResponse({ type: Loan })
  getLoan(@LoanRequest() loan: Loan): Loan {
    return loan;
  }

  @UsePipes(ValidationPipe)
  @Post("")
  @ApiOperation({ summary: "Create a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiInternalServerErrorResponse()
  @ApiConflictResponse()
  async createLoan(@CurrentUser() user: User, @ProductRequest() product: Product, @Body() body: LoanDto): Promise<Loan> {
    const loan = await this.loanService.create(product.id, user.id, body);
    if (!loan) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_CANT_CREATE"), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return loan;
  }

  @UsePipes(ValidationPipe)
  @Put("/:loanId")
  @UseGuards(LoanGuard)
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Update a loan" })
  @ApiOkResponse({ type: Loan })
  async updateLoan(@ProductRequest() product: Product, @LoanRequest() loan: Loan, @Body() body: LoanUpdatedDto): Promise<Loan> {
    await this.loanService.update(loan.id, body);
    const loanUpdated = await this.loanService.getLoan(product.id, loan.id);
    if (!loanUpdated) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return loanUpdated;
  }

  @Delete("/:loanId")
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Delete a loan" })
  @ApiOkResponse({ type: Loan })
  @ApiBadRequestResponse()
  async deleteLoan(@ProductRequest() product: Product, @LoanRequest() loan: Loan): Promise<void> {
    return this.loanService.delete(product.id, loan.id);
  }
}