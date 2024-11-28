import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game, Product, User } from '@playpal/schemas';

import { GameModule } from '@/game/game.module';
import { ProductController } from '@/product/controller/product.controller';
import { ProductService } from '@/product/service/product.service';
import { RedisModule } from "@/redis/redis.module";
import { TranslationService } from '@/translation/translation.service';
import { UsersModule } from '@/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RedisModule),
    forwardRef(() => UsersModule),
    forwardRef(() => GameModule)
  ],
  controllers: [ProductController],
  providers: [ProductService, TranslationService],
  exports: [ProductService],
})
export class ProductModule { }
