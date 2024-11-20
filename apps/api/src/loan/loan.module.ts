import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game, Loan, Product, User } from '@playpal/schemas';

import { LoanController } from '@/loan/controller/loan.controller';
import { LoanService } from '@/loan/service/loan.service';
import { RedisModule } from "@/redis/redis.module";
import { TranslationService } from '@/translation/translation.service';

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
