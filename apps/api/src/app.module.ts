import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './modules/health/health.controller';
import { AiController } from './modules/ai/ai.controller';
import { AiService } from './modules/ai/ai.service';
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [HealthController, AiController],
  providers: [AiService, SupabaseAuthGuard],
})
export class AppModule {}
