import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { Loan } from "@/loan/loan.entity";
import { Product } from "@/product/product.entity";
import { TranslationService } from "@/translation/translation.service";
import { User } from "@/user/user.entity";

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly translationsService: TranslationService
  ) { }

  async getAllLoan(productId: string): Promise<Loan[]> {
    return this.loanRepository
      .createQueryBuilder('loan')
      .where("loan.productId = :id", { id: productId })
      .leftJoinAndSelect("loan.user", "user")
      .leftJoinAndSelect("loan.product", "product")
      .getMany();
  }

  async getLoan(productId: string, loanId: string): Promise<Loan | null> {
    return this.loanRepository
      .createQueryBuilder("loan")
      .leftJoinAndSelect("loan.user", "user")
      .leftJoinAndSelect("loan.product", "product")
      .leftJoinAndSelect("product.game", "game")
      .where("loan.productId = :productId", { productId: productId })
      .andWhere("loan.id = :loanId", { loanId: loanId })
      .getOne();
  }

  async create(loanDto: LoanDto): Promise<Loan | null> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: loanDto.userId })
      .getOne();
    if (!user) {
      throw new HttpException(await this.translationsService.translate("error.USER_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const loan = this.loanRepository.create({
      ...loanDto,
      user
    });
    return this.loanRepository.save(loan);
  }

  async update(loanId: string, loanUpdatedDto: LoanUpdatedDto): Promise<void> {
    const query = await this.loanRepository
      .createQueryBuilder()
      .update(Loan)
      .set(loanUpdatedDto)
      .where("id = :id", { id: loanId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate('error.LOAN_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
  }

  async delete(productId: string, loanId: string): Promise<void> {
    const query = await this.loanRepository
      .createQueryBuilder()
      .delete()
      .from(Loan)
      .where("loan.id = :id", { id: loanId })
      .andWhere('loan."productId" = :productId', { productId: productId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate("error.LOAN_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
  }
}