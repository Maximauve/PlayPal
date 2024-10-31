import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    },
  };

  app.connectMicroservice(microserviceOptions);

  const config = new DocumentBuilder()
    .setTitle('Playpal')
    .setDescription('The playpal API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.startAllMicroservices();
  await app.listen(process.env.NEST_PORT || 3000);
}
bootstrap();