
import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TrustAiService } from './trust-ai.service';

@Controller('trust-ai')
export class TrustAiController {
  constructor(private readonly trustAiService: TrustAiService) {}

  @Post('evaluation/:evaluationId/generate')
  async generate(
    @Param('evaluationId', ParseIntPipe) evaluationId: number,
  ) {
    return this.trustAiService.generateFromEvaluation(evaluationId);
  }

  @Get('property/:propertyId/latest')
  async getLatestByProperty(
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ) {
    return this.trustAiService.getByProperty(propertyId);
  }
}

