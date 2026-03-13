

import { Module } from '@nestjs/common';
import { TrustService } from './trust.service';
import { TrustController } from './trust.controller';

import { CnjProvider } from './providers/cnj.provider';
import { ReceitaProvider } from './providers/receita.provider';
import { SerasaProvider } from './providers/serasa.provider';
import { InternalHistoryProvider } from './providers/internal-history.provider';
import { PropertyRegistryProvider } from './providers/property-registry.provider';

import { TrustAiService } from '../trust-ai/trust-ai.service';

@Module({
  controllers: [TrustController],
  providers: [
    TrustService,
    TrustAiService,
    CnjProvider,
    ReceitaProvider,
    SerasaProvider,
    InternalHistoryProvider,
    PropertyRegistryProvider,
  ],
  exports: [TrustService],
})
export class TrustModule {}


