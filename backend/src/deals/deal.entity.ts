
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';

import { Property } from '../properties/property.entity';

import { Transaction } from '../transactions/transaction.entity';


@Entity()
export class Deal {

  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  propertyId: number;


  @ManyToOne(() => Property, property => property.deals)
  @JoinColumn({ name: 'propertyId' })
  property: Property;


  @Column()
  buyerId: number;


  @Column()
  sellerId: number;


  @Column('decimal', { precision: 15, scale: 2 })
  price: number;



  @OneToMany(() => Transaction, transaction => transaction.deal)
  transactions: Transaction[];

}





