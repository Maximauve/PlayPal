import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Loan, Product, User } from "@playpal/schemas";
import { Repository } from "typeorm";

import { LoanDto } from "@/loan/dto/loan.dto";
import { LoanUpdatedDto } from "@/loan/dto/loanUpdated.dto";
import { TranslationService } from "@/translation/translation.service";

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

  async create(loanDto: LoanDto, product: Product): Promise<Loan | null> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: loanDto.userId })
      .getOne();
    if (!user) {
      throw new HttpException(await this.translationsService.translate("error.USER_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    const product = await this.productRepository
      .createQueryBuilder("product")
      .where("product.id = :id", { id: loanDto.productId })
      .getOne();
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const loan = this.loanRepository.create({
      ...loanDto,
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

  async findActiveLoansForProduct(productId: string): Promise<Loan[]> {
    const currentDate = new Date();
  
    return this.loanRepository.createQueryBuilder('loan')
      .leftJoinAndSelect('loan.product', 'product')
      .where('product.id = :productId', { productId })
      .andWhere('loan.startDate <= :currentDate', { currentDate })
      .andWhere('loan.endDate >= :currentDate', { currentDate })
      .orderBy('loan.startDate', 'ASC') 
      .getMany();
  }

  async checkProductNotRented(productId: string, newLoan: LoanDto) {
    const existingLoans = await this.findActiveLoansForProduct(productId);
  
    const now = new Date();
    const newStartDate = now;
    const newEndDate = new Date(newLoan.endDate);

  
    for (const existingLoan of existingLoans) {
      const existingStartDate = new Date(existingLoan.startDate);
      const existingEndDate = new Date(existingLoan.endDate);
  
      if (
        (newStartDate >= existingStartDate && newStartDate < existingEndDate) ||
        (newEndDate > existingStartDate && newEndDate <= existingEndDate) ||
        (newStartDate <= existingStartDate && newEndDate >= existingEndDate)
      ) {
        return true;
      }
    }
    return false;
  }
}
