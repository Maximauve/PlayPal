import { PartialType } from "@nestjs/swagger";

import { ProductDto } from "@/product/dto/product.dto";

export class ProductUpdatedDto extends PartialType(ProductDto) {}