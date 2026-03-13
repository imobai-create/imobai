
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';

import { Property } from './property.entity';



@Entity()
export class PropertyVideo {

  @PrimaryGeneratedColumn()
  id: number;



  @Column()
  url: string;



  @Column()
  propertyId: number;



  @ManyToOne(() => Property, property => property.videos, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

}










