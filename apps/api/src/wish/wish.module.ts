import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from '@/redis/redis.module';
import { TranslationService } from '@/translation/translation.service';
import { WishController } from '@/wish/controller/wish.controller';
import { WishService } from '@/wish/service/wish.service';
import { Wish } from '@/wish/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), forwardRef(() => RedisModule)],
  controllers: [WishController],
  providers: [WishService, TranslationService],
  exports: [WishService],

})

export class WishModule { }