import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common/utils';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { User } from './user.entity';
import {RedisModule} from "../redis/redis.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => RedisModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}