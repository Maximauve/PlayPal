import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
//* See i18n-nest doc : https://nestjs-i18n.com/guides/type-safety
// eslint-disable-next-line unicorn/import-style
import * as path from 'node:path';

import { AuthModule } from '@/auth/auth.module';
import { AuthExceptionFilter } from '@/auth/exception-filter/exception-filter'; 
import { Game } from '@/game/game.entity';
import { GameModule } from '@/game/game.module';
import { RedisModule } from '@/redis/redis.module';
import { TranslationService } from '@/translation/translation.service';
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
        entities: [User, Game],
        synchronize: true,
        extra: {
          ssl: configService.get('POSTGRES_SSL') === 'true',
        }
      }),
      inject: [ConfigService],
    } as TypeOrmModuleAsyncOptions),
    I18nModule.forRoot({
      fallbackLanguage: 'fr',
      fallbacks: {
        'fr-*': 'fr'
      },
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale'] },
        AcceptLanguageResolver,
      ],
    }),
    RedisModule,
    UsersModule,
    AuthModule,
    GameModule
  ],
  controllers: [],
  providers: [TranslationService, {
    provide: APP_FILTER,
    useClass: AuthExceptionFilter,
  }],
})
export class AppModule {}