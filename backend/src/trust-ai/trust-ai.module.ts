

import { Module } from '@nestjs/common';
import { TrustAiController } from './trust-ai.controller';
import { TrustAiService } from './trust-ai.service';

@Module({
  controllers: [TrustAiController],
  providers: [TrustAiService],
  exports: [TrustAiService],
})
export class TrustAiModule {}