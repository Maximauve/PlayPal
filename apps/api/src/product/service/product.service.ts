import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Game } from "@/game/game.entity";
import { ProductDto } from "@/product/dto/product.dto";
import { ProductUpdatedDto } from "@/product/dto/productUpdated.dto";
import { Product } from "@/product/product.entity";
import { TranslationService } from "@/translation/translation.service";
import { User } from "@/user/user.entity";

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

  async getAllProduct(gameId: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where("product.gameId = :id", { id: gameId })
      .leftJoinAndSelect("product.user", "user")
      .leftJoinAndSelect("product.game", "game")
      .leftJoinAndSelect("product.loan", "loan")
      .getMany();
  }

  async getProduct(gameId: string, productId: string): Promise<Product | null> {
    return this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.user", "user")
      .leftJoinAndSelect("product.game", "game")
      .leftJoinAndSelect("product.loan", "loan")
      .where("product.gameId = :gameId", { gameId: gameId })
      .andWhere("product.id = :productId", { productId: productId })
      .getOne();
  }

  async create(gameId: string, userId: string, productDto: ProductDto): Promise<Product | null> {
    const game = await this.gameRepository
      .createQueryBuilder("game")
      .where("game.id = :id", { id: gameId })
      .getOne();
    if (!game) {
      throw new HttpException(await this.translationsService.translate("error.GAME_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository
      .createQueryBuilder("user")
      .where("user.id = :id", { id: userId })
      .getOne();
    if (!user) {
      throw new HttpException(await this.translationsService.translate("error.USER_NOT_FOUND"), HttpStatus.NOT_FOUND);
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

  async delete(gameId: string, productId: string): Promise<void> {
    const query = await this.productRepository
      .createQueryBuilder()
      .delete()
      .from(Product)
      .where("product.id = :id", { id: productId })
      .andWhere('product."gameId" = :gameId', { gameId: gameId })
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
}