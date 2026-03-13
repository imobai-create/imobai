import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../users/user.entity';
import { Deal } from '../deals/deal.entity';
import { PropertyImage } from './property-image.entity';
import { PropertyVideo } from './property-video.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  address: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.properties)
  @JoinColumn({ name: 'userId' })
  user: User;

  // CAPA
  @Column({ nullable: true })
  image?: string;

  // GALERIA
  @OneToMany(() => PropertyImage, (image) => image.property, {
    cascade: true,
  })
  images: PropertyImage[];

  // VIDEOS
  @OneToMany(() => PropertyVideo, (video) => video.property, {
    cascade: true,
  })
  videos: PropertyVideo[];

  // DEALS
  @OneToMany(() => Deal, deal => deal.property)
  deals: Deal[];

  // TRANSACTIONS
  @OneToMany(() => Transaction, transaction => transaction.property)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}



