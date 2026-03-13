

import { Injectable } from '@nestjs/common';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ScoreInput {
  personType: 'PF' | 'PJ';
  document: string;
  fullName?: string;
}

export interface ScoreResult {
  score: number;
  riskLevel: RiskLevel;
  flags: string[];
  summary: string;
  sources: string[];
}

@Injectable()
export class ScoringService {
  async scorePerson(input: ScoreInput): Promise<ScoreResult> {
    let score = 100;
    const flags: string[] = [];
    const sources: string[] = [];

    const hasCadastroIssue = false;
    const hasExecution = true;
    const hasMultipleCases = true;
    const hasBankruptcy = false;

    sources.push('CNJ/DataJud', 'Receita Federal');

    if (hasCadastroIssue) {
      score -= 25;
      flags.push('Divergência cadastral relevante');
    }

    if (hasExecution) {
      score -= 20;
      flags.push('Execução identificada');
    }

    if (hasMultipleCases) {
      score -= 15;
      flags.push('Volume processual relevante');
    }

    if (hasBankruptcy) {
      score -= 35;
      flags.push('Falência/insolvência/recuperação identificada');
    }

    if (score < 0) score = 0;

    let riskLevel: RiskLevel = 'LOW';
    if (score < 50) riskLevel = 'CRITICAL';
    else if (score < 70) riskLevel = 'HIGH';
    else if (score < 85) riskLevel = 'MEDIUM';

    const summary =
      flags.length === 0
        ? 'Nenhum alerta relevante encontrado nas verificações iniciais.'
        : 'Há alertas jurídicos e/ou cadastrais que recomendam revisão antes do avanço.';

    return {
      score,
      riskLevel,
      flags,
      summary,
      sources,
    };
  }
}