import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game, Product, User } from "@playpal/schemas";
import { Repository } from "typeorm";

import { ProductDto } from "@/product/dto/product.dto";
import { ProductUpdatedDto } from "@/product/dto/productUpdated.dto";
import { TranslationService } from "@/translation/translation.service";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly translationsService: TranslationService
  ) { }

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect("product.user", "user")
      .leftJoinAndSelect("product.game", "game")
      .leftJoinAndSelect("product.loan", "loan")
      .getMany();
  }
  
  async getAllProductsByGameId(gameId: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where("product.gameId = :id", { id: gameId })
      .leftJoinAndSelect("product.user", "user")
      .leftJoinAndSelect("product.game", "game")
      .leftJoinAndSelect("product.loan", "loan")
      .getMany();
  }

  async getProduct(productId: string): Promise<Product | null> {
    return this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.user", "user")
      .leftJoinAndSelect("product.game", "game")
      .leftJoinAndSelect("product.loan", "loan")
      .andWhere("product.id = :productId", { productId: productId })
      .getOne();
  }

  async create(productDto: ProductDto): Promise<Product | null> {
    const game = await this.gameRepository
      .createQueryBuilder("game")
      .where("game.id = :id", { id: productDto.gameId })
      .getOne();
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const product = this.productRepository.create({
      ...productDto,
      game,
    });
    return this.productRepository.save(product);
  }

  async update(productId: string, productUpdatedDto: ProductUpdatedDto): Promise<void> {
    const query = await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set(productUpdatedDto)
      .where("id = :id", { id: productId })
      .execute(); 
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate('error.PRODUCT_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
  }

  async delete(productId: string): Promise<void> {
    const query = await this.productRepository
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where("product.id = :id", { id: productId })
      .execute();
    if (query.affected === 0) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
  }

  async assign(product: Product, user: User): Promise<Product | null> {
    product.user = user;
    product.available = false;
    return this.productRepository.save(product);
  }

  async unassign(product: Product): Promise<Product | null> {
    product.user = null;
    product.available = true;
    return this.productRepository.save(product);
  }

  async hasProductAvailable(gameId: string): Promise<boolean> {
    const query = await this.productRepository
      .createQueryBuilder("product")
      .where("product.gameId = :gameId", { gameId: gameId })
      .andWhere("product.available = TRUE")
      .getCount();

    return query > 0;
  }
}
