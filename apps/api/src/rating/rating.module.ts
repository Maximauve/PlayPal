import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game, Rating, User } from '@playpal/schemas';

import { GameModule } from '@/game/game.module';
import { RatingController } from '@/rating/controller/rating.controller';
import { RatingService } from '@/rating/service/rating.service';
import { RedisModule } from "@/redis/redis.module";
import { TranslationService } from '@/translation/translation.service';
import { UsersModule } from '@/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rating]),
    TypeOrmModule.forFeature([Game]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RedisModule),
    forwardRef(() => UsersModule),
    forwardRef(() => GameModule)
  ],
  controllers: [RatingController],
  providers: [RatingService, TranslationService],
  exports: [RatingService],
})
export class RatingModule { }
