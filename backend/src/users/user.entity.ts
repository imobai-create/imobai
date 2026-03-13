import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
OneToMany
} from 'typeorm';

import { Property } from '../properties/property.entity';

@Entity()
export class User {

@PrimaryGeneratedColumn()
id: number;

@Column()
name: string;

@Column({ unique: true })
email: string;

@Column()
password: string;

@CreateDateColumn()
createdAt: Date;

@OneToMany(
() => Property,
(property) => property.user
)
properties: Property[];

}



