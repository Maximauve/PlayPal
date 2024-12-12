import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Loan, LoanStatus, Product, User } from "@playpal/schemas";
import { Repository } from "typeorm";

import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { ProductService } from "@/product/service/product.service";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly translationsService: TranslationService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) { }

  async getAllLoan(): Promise<Loan[]> {
    return this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect("loan.user", "user")
      .leftJoinAndSelect("loan.product", "product")
      .getMany();
  }
  async getAllWaitingLoans(): Promise<Loan[]> {
    return this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect("loan.user", "user")
      .leftJoinAndSelect("loan.product", "product")
      .leftJoinAndSelect("product.game", "game")
      .where("loan.status = 'WAITING'")
      .getMany();
  }

  async getAllByProduct(productId: string): Promise<Loan[]> {
    return this.loanRepository
      .createQueryBuilder('loan')
      .where("loan.productId = :id", { id: productId })
      .leftJoinAndSelect("loan.user", "user")
      .leftJoinAndSelect("loan.product", "product")
      .getMany();
  }

  async getLoan(loanId: string): Promise<Loan | null> {
    return this.loanRepository
      .createQueryBuilder("loan")
      .leftJoinAndSelect("loan.user", "user")
      .leftJoinAndSelect("loan.product", "product")
      .leftJoinAndSelect("product.game", "game")
      .andWhere("loan.id = :loanId", { loanId: loanId })
      .getOne();
  }

  async create(user: User, product: Product, startDate: Date, endDate: Date, status: LoanStatus): Promise<Loan | null> {
   
    const loan = this.loanRepository.create({
      startDate,
      endDate,
      status,
      user,
      product
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
 
  async declineLoan(loanId: string): Promise<void> {
    const loan = await this.getLoan(loanId);
    const query = await this.loanRepository
      .createQueryBuilder()
      .update(Loan)
      .set({ ... loan, status: LoanStatus.DONE })
      .where("id = :id", { id: loanId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate('error.LOAN_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
  }

  async delete(loanId: string): Promise<void> {
    const query = await this.loanRepository
      .createQueryBuilder()
      .delete()
      .from(Loan)
      .where("loan.id = :id", { id: loanId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate("error.LOAN_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
  }

  async getProductAvailable(gameId: string): Promise<Product | null> {
    const products = await this.productService.getAllProductsByGameId(gameId);
    const product = products.find((p) => p.available);
    return product ?? null;
  }

  async endLoan(loan: Loan): Promise<Loan | null> {
    loan.status = LoanStatus.DONE;
    return this.loanRepository.save(loan);
  }
}
