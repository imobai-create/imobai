

import { Injectable } from '@nestjs/common';

@Injectable()
export class CnjProvider {
  async check(document: string) {
    const hasRelevantLawsuit = document.endsWith('99');

    return {
      provider_name: 'CNJ',
      provider_status: 'MOCK',
      raw_payload: {
        document,
        simulated: true,
      },
      normalized_payload: {
        found: true,
        hasRelevantLawsuit,
        lawsuitCount: hasRelevantLawsuit ? 3 : 0,
        risk: hasRelevantLawsuit ? 'HIGH' : 'LOW',
        details: hasRelevantLawsuit
          ? 'Foram encontrados processos relevantes vinculados ao documento.'
          : 'Nenhum processo relevante encontrado.',
      },
      risk_level: hasRelevantLawsuit ? 'HIGH' : 'LOW',
      score_impact: hasRelevantLawsuit ? 50 : 5,
    };
  }
}