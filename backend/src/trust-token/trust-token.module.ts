








import { Module } from '@nestjs/common';
import { TrustTokenController } from './trust-token.controller';
import { TrustTokenService } from './trust-token.service';

@Module({
  controllers: [TrustTokenController],
  providers: [TrustTokenService],
})
export class TrustTokenModule {}