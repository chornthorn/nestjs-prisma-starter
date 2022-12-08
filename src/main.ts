import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // use api prefix for all routes
  app.setGlobalPrefix('api');
  // enable cors for all clients
  app.enableCors({
    origin: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transform the payload to the DTO instance
      whitelist: true, // Remove extra properties from the payload
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.APP_PORT || 3000); // default port to 3000
}

bootstrap().then(() =>
  console.log(`Server is running on port ${process.env.APP_PORT}`),
);
