import {

Entity,

PrimaryGeneratedColumn,

Column,

CreateDateColumn,

} from 'typeorm';



export enum LeadStatus {

NEW = 'NEW',

CONTACTED = 'CONTACTED',

CLOSED = 'CLOSED',

LOST = 'LOST',

}



@Entity()

export class Lead {

@PrimaryGeneratedColumn()

id: number;



@Column()

name: string;



@Column()

email: string;



@Column()

phone: string;



@Column()

intent: string;



@Column('decimal', {

precision: 12,

scale: 2,

nullable: true,

})

price: number;



@Column({

type: 'enum',

enum: LeadStatus,

default: LeadStatus.NEW,

})

status: LeadStatus;



@Column({

nullable: true,

})

source: string;



@CreateDateColumn()

createdAt: Date;

}