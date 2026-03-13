
import { Injectable, NotFoundException } from '@nestjs/common';
import pool from '../db';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

@Injectable()
export class TrustAiService {
  private confidenceFromProviders(providerCount: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (providerCount >= 5) return 'HIGH';
    if (providerCount >= 3) return 'MEDIUM';
    return 'LOW';
  }

  private buildHeadline(riskLevel: RiskLevel, trustScore: number) {
    if (riskLevel === 'LOW') {
      return `Ativo com risco baixo e trust score ${trustScore}`;
    }
    if (riskLevel === 'MEDIUM') {
      return `Ativo com atenção moderada e trust score ${trustScore}`;
    }
    return `Ativo com risco elevado e trust score ${trustScore}`;
  }

  private buildRecommendedActions(
    scoreIdentity: number,
    scoreJudicial: number,
    scoreFinancial: number,
    scoreProperty: number,
  ) {
    const actions: string[] = [];

    if (scoreIdentity < 70) {
      actions.push('Revalidar CPF/CNPJ e consistência cadastral do titular.');
    }

    if (scoreJudicial < 70) {
      actions.push('Fazer revisão jurídica dos processos e certidões vinculadas ao titular.');
    }

    if (scoreFinancial < 70) {
      actions.push('Solicitar validação financeira complementar antes da conclusão da transação.');
    }

    if (scoreProperty < 70) {
      actions.push('Concluir diligência documental e patrimonial do imóvel.');
    }

    if (actions.length === 0) {
      actions.push('Manter monitoramento padrão e registrar novos eventos da negociação.');
    }

    return actions;
  }

  async generateFromEvaluation(evaluationId: number) {
    const evaluationRes = await pool.query(
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
        ex.summary_short AS rule_summary_short,
        ex.summary_long AS rule_summary_long,
        ex.recommended_actions AS rule_recommended_actions
      FROM trust_evaluation te
      LEFT JOIN trust_explanation ex
        ON ex.evaluation_id = te.id
      WHERE te.id = $1
      LIMIT 1
      `,
      [evaluationId],
    );

    const evaluation = evaluationRes.rows[0];

    if (!evaluation) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    const factorsRes = await pool.query(
      `
      SELECT
        factor_code,
        dimension,
        severity,
        weight,
        title,
        description,
        source_provider
      FROM trust_risk_factor
      WHERE evaluation_id = $1
      ORDER BY weight DESC, id DESC
      `,
      [evaluationId],
    );

    const providersRes = await pool.query(
      `
      SELECT
        provider_name,
        provider_status,
        risk_level,
        score_impact,
        normalized_payload
      FROM trust_provider_result
      WHERE evaluation_id = $1
      ORDER BY id ASC
      `,
      [evaluationId],
    );

    const factors = factorsRes.rows;
    const providers = providersRes.rows;

    const topFactors = factors.slice(0, 3);

    const factorSentence =
      topFactors.length > 0
        ? topFactors
            .map((f) => `${f.title} (${f.severity})`)
            .join(', ')
        : 'nenhum fator crítico relevante';

    const headline = this.buildHeadline(
      evaluation.risk_level,
      evaluation.trust_score,
    );

    const summaryShort = `Parecer IMOB.AI: risco ${evaluation.risk_level} com trust score ${evaluation.trust_score}. Principais sinais: ${factorSentence}.`;

    const summaryLong = [
      `A avaliação ${evaluation.id} resultou em trust score ${evaluation.trust_score} e nível de risco ${evaluation.risk_level}.`,
      `As dimensões avaliadas foram: identidade ${evaluation.score_identity}, judicial ${evaluation.score_judicial}, financeiro ${evaluation.score_financial} e imóvel ${evaluation.score_property}.`,
      topFactors.length
        ? `Os fatores mais relevantes identificados foram: ${topFactors
            .map((f) => `${f.title}: ${f.description}`)
            .join(' | ')}.`
        : 'Não foram encontrados fatores críticos relevantes nesta avaliação.',
      `Foram considerados ${providers.length} providers na análise.`,
    ].join(' ');

    const legalOpinion =
      evaluation.risk_level === 'HIGH'
        ? 'A transação deve ser tratada com cautela reforçada. Há sinais suficientes para justificar diligência complementar antes de qualquer avanço contratual ou financeiro.'
        : evaluation.risk_level === 'MEDIUM'
        ? 'A transação é viável, mas requer validações adicionais antes da conclusão. O risco não é impeditivo, porém também não é trivial.'
        : 'A transação apresenta perfil favorável com base nos sinais disponíveis. Ainda assim, devem ser mantidas as verificações documentais mínimas padrão.';

    const recommendedActions = this.buildRecommendedActions(
      evaluation.score_identity,
      evaluation.score_judicial,
      evaluation.score_financial,
      evaluation.score_property,
    );

    const confidenceLevel = this.confidenceFromProviders(providers.length);

    await pool.query(
      `
      INSERT INTO trust_ai_report (
        evaluation_id,
        headline,
        summary_short,
        summary_long,
        legal_opinion,
        recommended_actions,
        confidence_level,
        generated_by
      )
      VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,'AI_RULE_LAYER')
      ON CONFLICT (evaluation_id)
      DO UPDATE SET
        headline = EXCLUDED.headline,
        summary_short = EXCLUDED.summary_short,
        summary_long = EXCLUDED.summary_long,
        legal_opinion = EXCLUDED.legal_opinion,
        recommended_actions = EXCLUDED.recommended_actions,
        confidence_level = EXCLUDED.confidence_level
      `,
      [
        evaluationId,
        headline,
        summaryShort,
        summaryLong,
        legalOpinion,
        JSON.stringify(recommendedActions),
        confidenceLevel,
      ],
    );

    const reportRes = await pool.query(
      `
      SELECT
        id,
        evaluation_id,
        headline,
        summary_short,
        summary_long,
        legal_opinion,
        recommended_actions,
        confidence_level,
        generated_by,
        created_at
      FROM trust_ai_report
      WHERE evaluation_id = $1
      LIMIT 1
      `,
      [evaluationId],
    );

    return reportRes.rows[0];
  }

  async getByProperty(propertyId: number) {
    const evaluationRes = await pool.query(
      `
      SELECT id
      FROM trust_evaluation
      WHERE property_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT 1
      `,
      [propertyId],
    );

    const evaluation = evaluationRes.rows[0];

    if (!evaluation) {
      return null;
    }

    const reportRes = await pool.query(
      `
      SELECT
        id,
        evaluation_id,
        headline,
        summary_short,
        summary_long,
        legal_opinion,
        recommended_actions,
        confidence_level,
        generated_by,
        created_at
      FROM trust_ai_report
      WHERE evaluation_id = $1
      LIMIT 1
      `,
      [evaluation.id],
    );

    return reportRes.rows[0] ?? null;
  }
}