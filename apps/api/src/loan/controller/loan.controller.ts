import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Loan, LoanStatus, User } from "@playpal/schemas";

import { AdminGuard } from "@/auth/guards/admin.guard";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { events } from "@/event/types/events";
import { LoanRequest } from "@/loan/decorators/loan.decorator";
import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { LoanGuard } from "@/loan/guards/loan.guard";
import { LoanService } from "@/loan/service/loan.service";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { CurrentUser } from "@/user/decorators/currentUser.decorator";

@UseGuards(JwtAuthGuard)
@ApiTags('loan')
@ApiNotFoundResponse({ description: "Game or product not found" })
@ApiBadRequestResponse({ description: "UUID are invalid" })
@ApiUnauthorizedResponse({ description: "User not connected" })
@Controller('loan')
export class LoanController {
  constructor(
    private readonly translationsService: TranslationService,
    private readonly loanService: LoanService,
    private readonly productService: ProductService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @Get('')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Get all loan of a product" })
  @ApiOkResponse({ description: "Loans found successfully", type: Loan, isArray: true })
  async getAllLoan(): Promise<Loan[]> {
    return this.loanService.getAllLoan();
  }

  @Get('')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Get all loan of a product" })
  @ApiOkResponse({ description: "Loans found successfully", type: Loan, isArray: true })
  async getAllWaitingLoans(): Promise<Loan[]> {
    return this.loanService.getAllWaitingLoans();
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
  async createLoan(@CurrentUser() user: User, @Body() body: LoanDto): Promise<Loan> {
    const product = await this.loanService.getProductAvailable(body.gameId);
    if (product === null) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_ALREADY_RENTED"), HttpStatus.CONFLICT);
    }

    const loan = await this.loanService.create(user, product, body.endDate, LoanStatus.WAITING);
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
  @ApiNotFoundResponse({ description: "Loan not found" })
  async deleteLoan(@LoanRequest() loan: Loan): Promise<void> {
    await this.loanService.delete(loan.id);
  }

  @Post('/return/:loanId')
  @ApiParam({ name: 'loanId', description: 'ID of loan', required: true })
  @ApiOperation({ summary: 'Returns the loans and unassigns it from the attached user' })
  @ApiOkResponse({ description : 'The loan has been successfuly returned' })
  @ApiNotFoundResponse({ description: 'Loan or attached product not found' })
  @ApiInternalServerErrorResponse({ description: 'The loan could not been updated' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoanGuard)
  async returnLoan(@LoanRequest() loan: Loan): Promise<void> {
    if (loan.status !== LoanStatus.WAITING) {
      if (loan.status === LoanStatus.DONE) {
        throw new ForbiddenException(await this.translationsService.translate("error.ALREADY_RETURNED_LOAN"));
      }
      throw new ForbiddenException(await this.translationsService.translate("error.CANT_RETURN_LOAN_YOU_DONT_HAVE"));
    }
    const product = loan.product;
    if (!product) {
      throw new NotFoundException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"));
    }
    const productUpdated = await this.productService.unassign(product);
    if (!productUpdated) {
      throw new InternalServerErrorException(await this.translationsService.translate("error.SOMETHING_WENT_WRONG"));
    }
    const loanUpdated = await this.loanService.endLoan(loan);
    if (!loanUpdated) {
      throw new InternalServerErrorException(await this.translationsService.translate("error.SOMETHING_WENT_WRONG"));
    }
    this.eventEmitter.emit(events.product.returned, product);
  }

}
