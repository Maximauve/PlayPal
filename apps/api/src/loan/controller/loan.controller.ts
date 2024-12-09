import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Loan, Product } from "@playpal/schemas";

import { AdminGuard } from "@/auth/guards/admin.guard";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { LoanRequest } from "@/loan/decorators/loan.decorator";
import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { LoanGuard } from "@/loan/guards/loan.guard";
import { LoanService } from "@/loan/service/loan.service";
import { ProductRequest } from "@/product/decorators/product.decorator";
import { TranslationService } from "@/translation/translation.service";

@UseGuards(JwtAuthGuard)
@ApiTags('loan')
@ApiNotFoundResponse({ description: "Game or product not found" })
@ApiBadRequestResponse({ description: "UUID are invalid" })
@ApiUnauthorizedResponse({ description: "User not connected" })
@Controller('loan')
export class LoanController {
  constructor(private readonly translationsService: TranslationService, private readonly loanService: LoanService) { }

  @Get('')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Get all loan of a product" })
  @ApiOkResponse({ description: "Loans found successfully", type: Loan, isArray: true })
  async getAllLoan(): Promise<Loan[]> {
    return this.loanService.getAllLoan();
  }

  @Get("/:loanId")
  @UseGuards(LoanGuard)
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Return a loan" })
  @ApiOkResponse({ description: "Loan found successfully", type: Loan })
  @ApiNotFoundResponse({ description: "Game, product or loan not found" })
  getLoan(@LoanRequest() loan: Loan): Loan {
    return loan;
  }

  @Post("")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: "Create a loan" })
  @ApiCreatedResponse({ description: "Loan created successfully", type: Loan })
  @ApiInternalServerErrorResponse({ description: "An unexpected error occurred while creating the loan" })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  async createLoan(@ProductRequest() product: Product, @Body() body: LoanDto): Promise<Loan> {
    if (await this.loanService.checkProductNotRented(product.id, body)) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_ALREADY_RENTED"), HttpStatus.CONFLICT);
    }
    const loan = await this.loanService.create(body);
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
  @ApiOkResponse({ description: "Loan updated successfully", type: Loan })
  @ApiBadRequestResponse({ description: "UUID or Request body is invalid" })
  async updateLoan(@LoanRequest() loan: Loan, @Body() body: LoanUpdatedDto): Promise<Loan> {
    await this.loanService.update(loan.id, body);
    const loanUpdated = await this.loanService.getLoan(loan.id);
    if (!loanUpdated) {
      throw new HttpException(await this.translationsService.translate("error.LOAN_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    return loanUpdated;
  }

  @Delete("/:loanId")
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: "Delete a loan" })
  @ApiOkResponse({ description: "Loan deleted successfully" })
  @ApiNotFoundResponse({ description: "Game, product or loan not found" })
  async deleteLoan(@LoanRequest() loan: Loan): Promise<void> {
    await this.loanService.delete(loan.id);
  }
}
