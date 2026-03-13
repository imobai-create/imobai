import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Deal } from '../deals/deal.entity';
import { Property } from '../properties/property.entity';


/* =========================
   ENUMS
========================= */

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  ESCROW = 'ESCROW',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  ESCROW = 'ESCROW',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}


/* =========================
   ENTITY
========================= */

@Entity('transactions')
export class Transaction {

  @PrimaryGeneratedColumn()
  id: number;


  /* FK DEAL */

 

  @ManyToOne(
    () => Deal,
    deal => deal.transactions,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'dealId' })
  deal: Deal;



  /* FK PROPERTY */



  @ManyToOne(
    () => Property,
    property => property.transactions,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'propertyId' })
  property: Property;



  /* VALUE */

  @Column('decimal', {
    precision: 14,
    scale: 2,
  })
  amount: number;



  /* TYPE */

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;



  /* STATUS */

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;



  /* ESCROW WALLET */



@Column({ nullable: true, type: 'varchar' })
escrowWallet: string | null;




  /* BLOCKCHAIN */



@Column({ nullable: true, type: 'varchar' })
blockchainHash: string | null;

@Column({ nullable: true, type: 'varchar' })
txHash: string | null;




  /* DATE */

  @CreateDateColumn()
  createdAt: Date;

}