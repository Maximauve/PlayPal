import { type INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppModule } from './../src/app.module';
import { NestFactory } from '@nestjs/core';
import { AuthTesting } from './auth.testing';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

describe('Paypal Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new I18nValidationPipe());
    app.useGlobalFilters(
      new I18nValidationExceptionFilter({
        detailedErrors: false,
      }),
    );
    await app.listen(3000);

    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    await app.close();
  })

  // Users tests
  new AuthTesting(app!).routeTest();
});
