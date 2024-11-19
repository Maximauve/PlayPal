import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from '@/game/game.entity';
import { RedisModule } from '@/redis/redis.module';
import { TranslationService } from '@/translation/translation.service';
import { User } from '@/user/user.entity';
import { WishController } from '@/wish/controller/wish.controller';
import { WishService } from '@/wish/service/wish.service';
import { Wish } from '@/wish/wish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RedisModule)],
  controllers: [WishController],
  providers: [WishService, TranslationService],
  exports: [WishService],

})

export class WishModule { }