
import { Controller, Get, Param, Post } from '@nestjs/common';
import { TrustTokenService } from './trust-token.service';

@Controller('trust-token')
export class TrustTokenController {
  constructor(private readonly trustTokenService: TrustTokenService) {}

  @Post('issue/:dealId')
  async issue(@Param('dealId') dealId: string) {
    return this.trustTokenService.issueTrustToken(Number(dealId));
  }

  @Get(':dealId')
  async getByDealId(@Param('dealId') dealId: string) {
    return this.trustTokenService.getTrustTokenByDealId(Number(dealId));
  }
}
