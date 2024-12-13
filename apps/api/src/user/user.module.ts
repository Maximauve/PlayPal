import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@playpal/schemas';

import { FileUploadService } from '@/files/files.service';
import { RedisModule } from "@/redis/redis.module";
import { TranslationService } from '@/translation/translation.service';
import { UserController } from '@/user/controller/user.controller';
import { UserService } from '@/user/service/user.service';
import { WishModule } from '@/wish/wish.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RedisModule), forwardRef(() => WishModule)],
  controllers: [UserController],
  providers: [UserService, TranslationService, FileUploadService],
  exports: [UserService],
})
export class UsersModule { }
