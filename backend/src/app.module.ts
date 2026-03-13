import { Module } from '@nestjs/common';

import { UploadsModule } from './uploads/uploads.module';

import { TransactionsModule } from './transactions/transactions.module';

import { DealsModule } from './deals/deals.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from './properties/properties.module';
import { ScoringModule } from './scoring/scoring.module';


import { EscrowModule } from './escrow/escrow.module';

import { BlockchainModule } from './blockchain/blockchain.module';



import { RiskEngineModule } from './risk-engine/risk-engine.module'

import { TrustTokenModule } from './trust-token/trust-token.module';

import { TrustModule } from './trust/trust.module';

import { TrustAiModule } from './trust-ai/trust-ai.module';

@Module({

  

 imports: [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'imobai_db',
    autoLoadEntities: true,
    synchronize: false,
    dropSchema: false,
  }),
  PropertiesModule,
  UploadsModule,
  ScoringModule,
  TransactionsModule,
  EscrowModule,
  BlockchainModule,
  RiskEngineModule,
  TrustTokenModule,
  TrustModule,
  TrustAiModule,
],


})
export class AppModule {}