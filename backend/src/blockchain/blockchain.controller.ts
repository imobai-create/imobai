

import { Controller, Get, Post, Param } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('receipt/:dealId')
  async createReceipt(@Param('dealId') dealId: string) {
    return this.blockchainService.createReceipt(Number(dealId));
  }

  @Get('receipt/:dealId')
  async getReceipt(@Param('dealId') dealId: string) {
    return this.blockchainService.getReceiptByDealId(Number(dealId));
  }
}