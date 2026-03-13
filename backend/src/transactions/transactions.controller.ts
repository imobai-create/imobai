import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
} from '@nestjs/common';

import {
  TransactionsService,
} from './transactions.service';

import {
  TransactionStatus,
} from './transaction.entity';



@Controller('transactions')
export class TransactionsController {

  constructor(
    private service: TransactionsService,
  ) {}



  @Post()
  create(
    @Body() body: any,
  ) {
    return this.service.create(body);
  }



  @Get()
  findAll() {
    return this.service.findAll();
  }



  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,

    @Body('status') status: string,
  ) {

    return this.service.updateStatus(

      Number(id),

      status as TransactionStatus,

    );

  }

}