

import { Injectable } from '@nestjs/common';

@Injectable()
export class SerasaProvider {
  async check(document: string) {
    const hasRestriction = document.endsWith('88');

    return {
      provider_name: 'SERASA',
      provider_status: 'MOCK',
      raw_payload: {
        document,
        simulated: true,
      },
      normalized_payload: {
        found: true,
        hasRestriction,
        scoreBand: hasRestriction ? 'MEDIUM' : 'LOW',
        risk: hasRestriction ? 'MEDIUM' : 'LOW',
        details: hasRestriction
          ? 'Foram encontradas restrições financeiras moderadas.'
          : 'Nenhuma restrição financeira relevante encontrada.',
      },
      risk_level: hasRestriction ? 'MEDIUM' : 'LOW',
      score_impact: hasRestriction ? 30 : 5,
    };
  }
}