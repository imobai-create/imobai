import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from './transaction.entity';


@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}



  /* CREATE */


async create(data: {
  dealId: number;
  propertyId: number;
  amount: number;
  type: TransactionType;
}): Promise<Transaction> {

  const transaction = this.repo.create({

    deal: { id: data.dealId },

    property: { id: data.propertyId },

    amount: data.amount,

    type: data.type,

    status: TransactionStatus.PENDING,

    escrowWallet: null,

    blockchainHash: null,

    txHash: null,

  } as DeepPartial<Transaction>);


  return await this.repo.save(transaction);

}



  /* FIND ONE */

  async findOne(id: number): Promise<Transaction> {

    const transaction = await this.repo.findOne({
      where: { id },
    });

    if (!transaction)
      throw new NotFoundException('Transaction not found');

    return transaction;

  }

  async findAll(): Promise<Transaction[]> {

  return await this.repo.find({

    relations: ['deal', 'property'],

    order: { createdAt: 'DESC' }

  });

}


  /* UPDATE STATUS */

  async updateStatus(
    id: number,
    status: TransactionStatus,
  ): Promise<Transaction> {

    const transaction = await this.findOne(id);

    transaction.status = status;

    return await this.repo.save(transaction);

  }

}
