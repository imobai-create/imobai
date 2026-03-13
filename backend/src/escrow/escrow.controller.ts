


import { Controller, Post, Param } from '@nestjs/common';
import { EscrowService } from './escrow.service';

@Controller('escrow')
export class EscrowController {

  constructor(private escrowService: EscrowService) {}

  @Post('create/:dealId')
  async create(@Param('dealId') dealId: number) {
    return this.escrowService.createEscrow(dealId);
  }

  @Post('deposit/:dealId')
  async deposit(@Param('dealId') dealId: number) {
    return this.escrowService.deposit(dealId);
  }

  @Post('release/:dealId')
  async release(@Param('dealId') dealId: number) {
    return this.escrowService.release(dealId);
  }

  @Post('refund/:dealId')
  async refund(@Param('dealId') dealId: number) {
    return this.escrowService.refund(dealId);
  }

}