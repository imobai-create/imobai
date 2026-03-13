

import { Injectable } from '@nestjs/common';
import pool from '../../db';

@Injectable()
export class InternalHistoryProvider {
  async check(propertyId?: number, dealId?: number) {
    let tokenCount = 0;
    let receiptCount = 0;
    let dealCount = 0;

    if (propertyId) {
      const tokenRes = await pool.query(
        `SELECT COUNT(*)::int AS count FROM trust_token WHERE property_id = $1`,
        [propertyId],
      );
      tokenCount = tokenRes.rows[0]?.count ?? 0;

      const dealRes = await pool.query(
        `SELECT COUNT(*)::int AS count FROM deal WHERE property_id = $1`,
        [propertyId],
      );
      dealCount = dealRes.rows[0]?.count ?? 0;
    }

    if (dealId) {
      const receiptRes = await pool.query(
        `SELECT COUNT(*)::int AS count FROM deal_blockchain_receipt WHERE deal_id = $1`,
        [dealId],
      );
      receiptCount = receiptRes.rows[0]?.count ?? 0;
    }

    const hasHistory = tokenCount > 0 || receiptCount > 0 || dealCount > 0;

    return {
      provider_name: 'INTERNAL_HISTORY',
      provider_status: 'SUCCESS',
      raw_payload: {
        propertyId: propertyId ?? null,
        dealId: dealId ?? null,
      },
      normalized_payload: {
        tokenCount,
        receiptCount,
        dealCount,
        hasHistory,
        risk: hasHistory ? 'LOW' : 'MEDIUM',
        details: hasHistory
          ? 'Há histórico interno do ativo/transação na plataforma.'
          : 'Ativo com pouco ou nenhum histórico interno na plataforma.',
      },
      risk_level: hasHistory ? 'LOW' : 'MEDIUM',
      score_impact: hasHistory ? 5 : 20,
    };
  }
}



