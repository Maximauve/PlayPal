import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from '@/game/game.entity';
import { LoanController } from '@/loan/controller/loan.controller';
import { Loan } from '@/loan/loan.entity';
import { LoanService } from '@/loan/service/loan.service';
import { Product } from '@/product/product.entity';
import { RedisModule } from "@/redis/redis.module";
import { TranslationService } from '@/translation/translation.service';
import { User } from '@/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RedisModule),
  ],
  controllers: [LoanController],
  providers: [LoanService, TranslationService],
  exports: [LoanService],
})
export class LoanModule { }