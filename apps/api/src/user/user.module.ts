import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileUploadService } from '@/files/files.service';
import { RedisModule } from "@/redis/redis.module";
import { TranslationService } from '@/translation/translation.service';
import { UserController } from '@/user/controller/user.controller';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RedisModule)],
  controllers: [UserController],
  providers: [UserService, TranslationService, FileUploadService],
  exports: [UserService],
})
export class UsersModule { }