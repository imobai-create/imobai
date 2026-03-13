

import { Injectable } from '@nestjs/common';
import pool from '../db';
import { TrustQueryDto } from './dto/trust-query.dto';
import { CnjProvider } from './providers/cnj.provider';
import { ReceitaProvider } from './providers/receita.provider';
import { SerasaProvider } from './providers/serasa.provider';
import { InternalHistoryProvider } from './providers/internal-history.provider';
import { PropertyRegistryProvider } from './providers/property-registry.provider';
import { TrustAiService } from '../trust-ai/trust-ai.service';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

type ProviderResult = {
  provider_name: string;
  provider_status: string;
  raw_payload: any;
  normalized_payload: any;
  risk_level: RiskLevel;
  score_impact: number;
};

@Injectable()
export class TrustService {
  

constructor(
  private readonly cnjProvider: CnjProvider,
  private readonly receitaProvider: ReceitaProvider,
  private readonly serasaProvider: SerasaProvider,
  private readonly internalHistoryProvider: InternalHistoryProvider,
  private readonly propertyRegistryProvider: PropertyRegistryProvider,
  private readonly trustAiService: TrustAiService,
) {}


  private riskFromScore(score: number): RiskLevel {
    if (score >= 80) return 'LOW';
    if (score >= 60) return 'MEDIUM';
    return 'HIGH';
  }

  private clamp(score: number): number {
    if (score < 0) return 0;
    if (score > 100) return 100;
    return score;
  }

  private buildExplanation(
    scoreIdentity: number,
    scoreJudicial: number,
    scoreFinancial: number,
    scoreProperty: number,
    trustScore: number,
    riskLevel: RiskLevel,
    factors: Array<{
      factor_code: string;
      dimension: string;
      severity: RiskLevel;
      weight: number;
      title: string;
      description: string;
      source_provider: string;
    }>,
  ) {
    const topFactors = factors
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map((f) => `${f.title}: ${f.description}`);

    const summaryShort = `Score ${trustScore} (${riskLevel}) • Identidade ${scoreIdentity} • Judicial ${scoreJudicial} • Financeiro ${scoreFinancial} • Imóvel ${scoreProperty}`;

    const summaryLong = [
      `A avaliação resultou em trust score ${trustScore} com nível de risco ${riskLevel}.`,
      `Dimensões: identidade ${scoreIdentity}, judicial ${scoreJudicial}, financeiro ${scoreFinancial}, imóvel ${scoreProperty}.`,
      topFactors.length
        ? `Principais fatores: ${topFactors.join(' | ')}`
        : 'Nenhum fator relevante foi encontrado.',
    ].join(' ');

    const recommendedActions: string[] = [];

    if (scoreJudicial < 70) {
      recommendedActions.push('Revisar passivos judiciais vinculados ao titular.');
    }
    if (scoreFinancial < 70) {
      recommendedActions.push('Solicitar validação financeira complementar antes da conclusão.');
    }
    if (scoreProperty < 70) {
      recommendedActions.push('Concluir diligência do imóvel antes de avançar.');
    }
    if (scoreIdentity < 70) {
      recommendedActions.push('Revalidar consistência documental do titular.');
    }

    return {
      summaryShort,
      summaryLong,
      recommendedActions,
    };
  }

  async evaluate(body: TrustQueryDto) {
    const {
      document,
      personType,
      subjectType,
      propertyId,
      dealId,
    } = body;

if (!document) {
  throw new Error('document is required');
}

    const [cnj, receita, serasa, internalHistory, propertyRegistry] =
      await Promise.all([
        this.cnjProvider.check(document),
        this.receitaProvider.check(document, personType),
        this.serasaProvider.check(document),
        this.internalHistoryProvider.check(propertyId, dealId),
        this.propertyRegistryProvider.check(propertyId),
      ]);

    const providerResults = [cnj, receita, serasa, internalHistory, propertyRegistry];

    let scoreIdentity = 100;
    let scoreJudicial = 100;
    let scoreFinancial = 100;
    let scoreProperty = 100;

    const factors: Array<{
      factor_code: string;
      dimension: string;
      severity: RiskLevel;
      weight: number;
      title: string;
      description: string;
      source_provider: string;
    }> = [];

    if (receita.score_impact > 0) {
      scoreIdentity = this.clamp(100 - receita.score_impact);
      if (receita.risk_level !== 'LOW') {
        factors.push({
          factor_code: 'DOCUMENT_INVALID',
          dimension: 'IDENTITY',
          severity: receita.risk_level as RiskLevel,
          weight: receita.score_impact,
          title: 'Documento inconsistente',
          description: receita.normalized_payload.details,
          source_provider: receita.provider_name,
        });
      }
    }

    if (cnj.score_impact > 0) {
      scoreJudicial = this.clamp(100 - cnj.score_impact);
      if (cnj.risk_level !== 'LOW') {
        factors.push({
          factor_code: 'JUDICIAL_RELEVANT_CASE',
          dimension: 'JUDICIAL',
          severity: cnj.risk_level as RiskLevel,
          weight: cnj.score_impact,
          title: 'Passivo judicial relevante',
          description: cnj.normalized_payload.details,
          source_provider: cnj.provider_name,
        });
      }
    }

    if (serasa.score_impact > 0) {
      scoreFinancial = this.clamp(100 - serasa.score_impact);
      if (serasa.risk_level !== 'LOW') {
        factors.push({
          factor_code: 'FINANCIAL_RESTRICTION',
          dimension: 'FINANCIAL',
          severity: serasa.risk_level as RiskLevel,
          weight: serasa.score_impact,
          title: 'Restrição financeira',
          description: serasa.normalized_payload.details,
          source_provider: serasa.provider_name,
        });
      }
    }

    const propertyPenalty = Math.max(
      internalHistory.score_impact,
      propertyRegistry.score_impact,
    );
    scoreProperty = this.clamp(100 - propertyPenalty);

    if (internalHistory.risk_level !== 'LOW') {
      factors.push({
        factor_code: 'LIMITED_INTERNAL_HISTORY',
        dimension: 'PROPERTY',
        severity: internalHistory.risk_level as RiskLevel,
        weight: internalHistory.score_impact,
        title: 'Baixo histórico interno',
        description: internalHistory.normalized_payload.details,
        source_provider: internalHistory.provider_name,
      });
    }

    if (propertyRegistry.risk_level !== 'LOW') {
      factors.push({
        factor_code: 'PROPERTY_DILIGENCE_PENDING',
        dimension: 'PROPERTY',
        severity: propertyRegistry.risk_level as RiskLevel,
        weight: propertyRegistry.score_impact,
        title: 'Diligência pendente',
        description: propertyRegistry.normalized_payload.details,
        source_provider: propertyRegistry.provider_name,
      });
    }

    const trustScore = this.clamp(
      Math.round(
        scoreIdentity * 0.2 +
          scoreJudicial * 0.35 +
          scoreFinancial * 0.2 +
          scoreProperty * 0.25,
      ),
    );

    const riskLevel = this.riskFromScore(trustScore);

    const explanation = this.buildExplanation(
      scoreIdentity,
      scoreJudicial,
      scoreFinancial,
      scoreProperty,
      trustScore,
      riskLevel,
      factors,
    );

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      
const evaluationRes = await client.query(
`
INSERT INTO trust_evaluation (
  property_id,
  deal_id,
  document,
  subject_document,
  subject_type,
  person_type,
  engine_version,
  score_identity,
  score_judicial,
  score_financial,
  score_property,
  trust_score,
  risk_level,
  status,
  generated_at
)
VALUES (
  $1,$2,$3,$4,$5,$6,
  'v1',
  $7,$8,$9,$10,$11,$12,
  'COMPLETED',
  NOW()
)
RETURNING id
`,
[
  propertyId ?? null,
  dealId ?? null,
  document,
  document,
  subjectType,
  personType,
  scoreIdentity,
  scoreJudicial,
  scoreFinancial,
  scoreProperty,
  trustScore,
  riskLevel
]
);

      const evaluationId = evaluationRes.rows[0].id;

      for (const provider of providerResults) {
        await client.query(
          `
          INSERT INTO trust_provider_result (
            evaluation_id,
            provider_name,
            provider_status,
            raw_payload,
            normalized_payload,
            risk_level,
            score_impact
          )
          VALUES ($1,$2,$3,$4::jsonb,$5::jsonb,$6,$7)
          `,
          [
            evaluationId,
            provider.provider_name,
            provider.provider_status,
            JSON.stringify(provider.raw_payload),
            JSON.stringify(provider.normalized_payload),
            provider.risk_level,
            provider.score_impact,
          ],
        );
      }

      for (const factor of factors) {
        await client.query(
          `
          INSERT INTO trust_risk_factor (
            evaluation_id,
            factor_code,
            dimension,
            severity,
            weight,
            title,
            description,
            source_provider
          )
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
          `,
          [
            evaluationId,
            factor.factor_code,
            factor.dimension,
            factor.severity,
            factor.weight,
            factor.title,
            factor.description,
            factor.source_provider,
          ],
        );
      }

      await client.query(
        `
        INSERT INTO trust_explanation (
          evaluation_id,
          summary_short,
          summary_long,
          recommended_actions,
          generated_by
        )
        VALUES ($1,$2,$3,$4::jsonb,'RULE_ENGINE')
        `,
        [
          evaluationId,
          explanation.summaryShort,
          explanation.summaryLong,
          JSON.stringify(explanation.recommendedActions),
        ],
      );

      if (propertyId) {
        await client.query(
          `
          INSERT INTO property_trust_snapshot (
            property_id,
            evaluation_id,
            trust_score,
            risk_level,
            summary_short
          )
          VALUES ($1,$2,$3,$4,$5)
          `,
          [
            propertyId,
            evaluationId,
            trustScore,
            riskLevel,
            explanation.summaryShort,
          ],
        );

        await client.query(
          `
          UPDATE property
          SET
            score = $1,
            risk_level = $2,
            updated_at = NOW()
          WHERE id = $3
          `,
          [trustScore, riskLevel, propertyId],
        );

        await client.query(
          `
          UPDATE trust_token
          SET
            trust_score = $1,
            risk_level = $2,
            updated_at = NOW()
          WHERE property_id = $3
          `,
          [trustScore, riskLevel, propertyId],
        );
      }

    
await client.query('COMMIT');

const aiReport = await this.trustAiService.generateFromEvaluation(evaluationId);

return {
  evaluation_id: evaluationId,
  property_id: propertyId ?? null,
  deal_id: dealId ?? null,
  subject_document: document,
  subject_type: subjectType,
  person_type: personType,
  score_identity: scoreIdentity,
  score_judicial: scoreJudicial,
  score_financial: scoreFinancial,
  score_property: scoreProperty,
  trust_score: trustScore,
  risk_level: riskLevel,
  explanation,
  ai_report: aiReport,
};

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getLatestByProperty(propertyId: number) {
    const res = await pool.query(
      `
      SELECT
        te.id,
        te.property_id,
        te.deal_id,
        te.subject_document,
        te.subject_type,
        te.person_type,
        te.engine_version,
        te.score_identity,
        te.score_judicial,
        te.score_financial,
        te.score_property,
        te.trust_score,
        te.risk_level,
        te.status,
        te.created_at,
        ex.summary_short,
        ex.summary_long,
        ex.recommended_actions
      FROM trust_evaluation te
      LEFT JOIN trust_explanation ex
        ON ex.evaluation_id = te.id
      WHERE te.property_id = $1
      ORDER BY te.created_at DESC, te.id DESC
      LIMIT 1
      `,
      [propertyId],
    );

    return res.rows[0] ?? null;
  }
}






