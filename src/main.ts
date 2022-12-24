import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  // enable cors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // serve static files
  app.useStaticAssets(join(__dirname, '..', 'docs'));

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const config = new DocumentBuilder()
    .setTitle('Room Booking API')
    .setDescription('The Room Booking API for how to consume API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      description: 'JWT access token',
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        description: 'JWT refresh token',
      },
      'bearer-refresh',
    )
    .setContact(
      'CHORN Thorn',
      'https://github.com/chornthorn',
      'chornthorn.kh@gmail.com',
    )
    .setExternalDoc('How Application work?', 'http://localhost:3050/index.html')
    .addServer('http://localhost:3050')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap().then(() => console.log('Server started'));
