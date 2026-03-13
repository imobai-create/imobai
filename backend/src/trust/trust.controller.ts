
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TrustService } from './trust.service';
import { TrustQueryDto } from './dto/trust-query.dto';

@Controller('trust')
export class TrustController {
  constructor(private readonly trustService: TrustService) {}

  @Post('evaluate')
  async evaluate(@Body() body: TrustQueryDto) {
    return this.trustService.evaluate(body);
  }

  @Get('property/:propertyId/latest')
  async getLatestByProperty(
    @Param('propertyId', ParseIntPipe) propertyId: number,
  ) {
    return this.trustService.getLatestByProperty(propertyId);
  }
}


