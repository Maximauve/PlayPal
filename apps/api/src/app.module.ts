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
import { FileUploadModule } from '@/files/files.module';
import { GameModule } from '@/game/game.module';
import { LoanModule } from '@/loan/loan.module';
import { ProductModule } from '@/product/product.module';
import { RatingModule } from '@/rating/rating.module';
import { RedisModule } from '@/redis/redis.module';
import { TagModule } from '@/tag/tag.module';
import { TranslationService } from '@/translation/translation.service';
import { UsersModule } from '@/user/user.module';
import { WishModule } from '@/wish/wish.module';

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
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
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
    GameModule,
    RatingModule,
    ProductModule,
    LoanModule,
    TagModule,
    FileUploadModule,
    WishModule
  ],
  controllers: [],
  providers: [TranslationService, {
    provide: APP_FILTER,
    useClass: AuthExceptionFilter,
  }],
})
export class AppModule { }