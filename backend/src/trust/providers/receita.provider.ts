
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceitaProvider {
  async check(document: string, personType: 'PF' | 'PJ') {
    const valid = document.length >= (personType === 'PF' ? 11 : 14);

    return {
      provider_name: 'RECEITA',
      provider_status: 'MOCK',
      raw_payload: {
        document,
        personType,
        simulated: true,
      },
      normalized_payload: {
        found: true,
        valid,
        status: valid ? 'REGULAR' : 'INVALID',
        risk: valid ? 'LOW' : 'HIGH',
        details: valid
          ? 'Documento com estrutura válida para consulta.'
          : 'Documento inválido ou inconsistente.',
      },
      risk_level: valid ? 'LOW' : 'HIGH',
      score_impact: valid ? 5 : 60,
    };
  }
}

