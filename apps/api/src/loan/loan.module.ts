import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from '@/game/game.entity';
<<<<<<< HEAD
=======
import { GameModule } from '@/game/game.module';
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
import { LoanController } from '@/loan/controller/loan.controller';
import { Loan } from '@/loan/loan.entity';
import { LoanService } from '@/loan/service/loan.service';
import { Product } from '@/product/product.entity';
<<<<<<< HEAD
import { RedisModule } from "@/redis/redis.module";
import { TranslationService } from '@/translation/translation.service';
import { User } from '@/user/user.entity';
=======
import { ProductModule } from '@/product/product.module';
import { RedisModule } from "@/redis/redis.module";
import { TranslationService } from '@/translation/translation.service';
import { User } from '@/user/user.entity';
import { UsersModule } from '@/user/user.module';
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)

@Module({
  imports: [TypeOrmModule.forFeature([Loan]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RedisModule),
<<<<<<< HEAD
=======
    forwardRef(() => UsersModule),
    forwardRef(() => GameModule),
    forwardRef(() => ProductModule)
>>>>>>> a821a85 (feat(api/loan): add loan CRUD & UT)
  ],
  controllers: [LoanController],
  providers: [LoanService, TranslationService],
  exports: [LoanService],
})
export class LoanModule { }