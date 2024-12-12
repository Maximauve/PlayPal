import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Game, Loan, Product, Rating, Rule, Tag, User, Wish } from '@playpal/schemas';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
//* See i18n-nest doc : https://nestjs-i18n.com/guides/type-safety
// eslint-disable-next-line unicorn/import-style
import * as path from 'node:path';

import { AuthModule } from '@/auth/auth.module';
import { AuthExceptionFilter } from '@/auth/exception-filter/exception-filter';
import { EventModule } from '@/event/events.module';
import { FileUploadModule } from '@/files/files.module';
import { FixturesModule } from '@/fixtures/fixture.module';
import { GameModule } from '@/game/game.module';
import { GameSubscriber } from '@/game/guards/game.subscriber';
import { LoanModule } from '@/loan/loan.module';
import { MailModule } from '@/mail/mail.module';
import { ProductModule } from '@/product/product.module';
import { RatingModule } from '@/rating/rating.module';
import { RedisModule } from '@/redis/redis.module';
import { RuleModule } from '@/rule/rule.module';
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
        entities: [User, Game, Loan, Product, Rating, Tag, Wish, Rule],
        autoLoadEntities: true,
        synchronize: true,
        extra: {
          ssl: configService.get('POSTGRES_SSL') === 'true',
        },
        subscribers: [GameSubscriber],
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
    EventEmitterModule.forRoot(),
    RedisModule,
    UsersModule,
    AuthModule,
    GameModule,
    RatingModule,
    ProductModule,
    LoanModule,
    TagModule,
    RuleModule,
    FileUploadModule,
    WishModule,
    FixturesModule,
    MailModule,
    EventModule,
  ],
  controllers: [],
  providers: [TranslationService, {
    provide: APP_FILTER,
    useClass: AuthExceptionFilter,
  }],
})
export class AppModule { }
