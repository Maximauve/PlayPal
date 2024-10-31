import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { RedisModule } from '@/redis/redis.module';
import { User } from '@/user/user.entity';
import { UsersModule } from '@/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [User],
        synchronize: true,
        extra: {
          ssl: configService.get('POSTGRES_SSL') === 'true',
        }
      }),
      inject: [ConfigService],
    } as TypeOrmModuleAsyncOptions),
    RedisModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}