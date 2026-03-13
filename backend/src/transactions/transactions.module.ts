import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Deal } from 'src/deals/deal.entity';
import { Property } from 'src/properties/property.entity';
import { User } from 'src/users/user.entity';
import { PropertyImage } from '../properties/property-image.entity';
import { PropertyVideo } from '../properties/property-video.entity';

@Module({

imports: [
TypeOrmModule.forFeature([Transaction,Deal,Property,PropertyImage,PropertyVideo,User])
],

providers: [TransactionsService],

controllers: [TransactionsController],

exports: [TransactionsService]

})
export class TransactionsModule {}
