import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Deal } from './deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';

@Injectable()
export class DealsService {

  constructor(
    @InjectRepository(Deal)
    private readonly dealsRepository: Repository<Deal>,
  ) {}



  async create(createDealDto: CreateDealDto): Promise<Deal> {

    const deal = this.dealsRepository.create({
      propertyId: createDealDto.propertyId,
      buyerId: createDealDto.buyerId,
      sellerId: createDealDto.sellerId,
      price: createDealDto.price,
    });

    return this.dealsRepository.save(deal);

  }



  async findAll(): Promise<Deal[]> {

    return this.dealsRepository.find();

  }



  async findOne(id: number): Promise<Deal> {

    const deal = await this.dealsRepository.findOne({
      where: { id }
    });

    if (!deal) {
      throw new Error('Deal not found');
    }

    return deal;

  }

}