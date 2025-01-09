import { Module } from "@nestjs/common";
import { AgentsModule } from "./agents/agents.module";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseMessageInterceptor } from "./lib/interceptors/response";
import { ApiKeyGuard } from "./lib/guard/ApikeyGuard";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [AgentsModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseMessageInterceptor,
    },
  ],
})
export class AppModule {}
