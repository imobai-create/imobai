

import { Body, Controller, Get, Post } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { TrustService } from '../trust/trust.service';

@Controller('deals')
export class DealsController {

  constructor(
    private readonly dealsService: DealsService,
    private readonly trustService: TrustService,
  ) {}

  @Post()
  async create(@Body() createDealDto: CreateDealDto) {

    // cria o deal primeiro
    const deal = await this.dealsService.create(createDealDto);

    // executa o Trust Engine automaticamente
    await this.trustService.evaluate({
  propertyId: deal.propertyId,
  dealId: deal.id,
  document: '00000000000',
  personType: 'PF',
  subjectType: 'BUYER'
});

    return deal;
  }

  @Get()
  findAll() {
    return this.dealsService.findAll();
  }

}

