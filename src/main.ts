import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import helmet from "helmet";
import { HttpExceptionFilter } from "./lib/global-filters/http";
import { allLeftOverExceptionFilter } from "./lib/global-filters/all";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validateCustomDecorators: true,
    })
  );

  app.useGlobalFilters(
    new allLeftOverExceptionFilter(),
    new HttpExceptionFilter()
  );
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.setGlobalPrefix("/api");
  await app.listen(process.env.PORT ?? 3000, "0.0.0.0");
}
bootstrap();
