import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game, User, Wish } from '@playpal/schemas';

import { RedisModule } from '@/redis/redis.module';
import { TranslationService } from '@/translation/translation.service';
import { UsersModule } from '@/user/user.module';
import { WishController } from '@/wish/controller/wish.controller';
import { WishService } from '@/wish/service/wish.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish]),
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RedisModule),
    forwardRef(() => UsersModule)],
  controllers: [WishController],
  providers: [WishService, TranslationService],
  exports: [WishService],

})

export class WishModule { }
