import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Product } from "@/product/product.entity";
import { RequestWithProduct } from "@/product/types/RequestWithProduct";
import { TranslationService } from "@/translation/translation.service";
import { uuidRegex } from "@/utils/regex.variable";

@Injectable()
export class ProductGuard implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly translationsService: TranslationService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithProduct>();
    const gameId = request.params.gameId;
    const productId = request.params.productId;

    if (!uuidRegex.test(productId) || !uuidRegex.test(gameId)) {
      throw new HttpException(await this.translationsService.translate("error.ID_INVALID"), HttpStatus.BAD_REQUEST);
    }

    const product = await this.productRepository.findOne({
      where: {
        id: productId,
        game: {
          id: gameId
        }
      },
      relations: {
        game: true
      }
    });
    if (!product) {
      throw new HttpException(await this.translationsService.translate("error.PRODUCT_NOT_FOUND"), HttpStatus.NOT_FOUND);
    }

    request.product = product;
    return true;
  }
}