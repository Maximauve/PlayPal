import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Loan } from "@playpal/schemas";
import { Repository } from "typeorm";

import { RequestWithLoan } from "@/loan/types/RequestWithLoan";
import { TranslationService } from "@/translation/translation.service";
import { uuidRegex } from "@/utils/regex.variable";

@Injectable()
export class LoanGuard implements CanActivate {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    private readonly translationsService: TranslationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithLoan>();
    const gameId = request.params.gameId;
    const productId = request.params.productId;
    const loanId = request.params.loanId;

    if (!uuidRegex.test(productId) || !uuidRegex.test(gameId) || !uuidRegex.test(loanId)) {
      throw new HttpException(await this.translationsService.translate("error.ID_INVALID"), HttpStatus.BAD_REQUEST);
    }

    const loan = await this.loanRepository.findOne({
      where: {
        id: loanId,
        product: {
          id: productId,
          game: {
            id: gameId
          }
        }
      },
      relations: {
        product: {
          game: true
        },
        user: true
      }
    });

    if (!loan) {
      throw new HttpException(await this.translationsService.translate("error.LOAN_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    request.loan = loan;
    return true;
  }
}
