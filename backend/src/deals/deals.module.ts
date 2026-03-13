import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Deal } from './deal.entity';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';

import { Property } from '../properties/property.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deal,Property,User])],
  providers: [DealsService],
  controllers: [DealsController],
})
export class DealsModule {}