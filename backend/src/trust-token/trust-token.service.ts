
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TrustTokenService {
 private pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : false,
});

  async issueTrustToken(dealId: number) {
    const existingToken = await this.pool.query(
      `
      SELECT *
      FROM trust_token
      WHERE deal_id = $1
      LIMIT 1
      `,
      [dealId],
    );

    if (existingToken.rows.length > 0) {
      return existingToken.rows[0];
    }

    const dealRes = await this.pool.query(
      `
      SELECT
        id,
        property_id,
        buyer_user_id,
        seller_user_id,
        price,
        status
      FROM deal
      WHERE id = $1
      LIMIT 1
      `,
      [dealId],
    );

    if (dealRes.rows.length === 0) {
      throw new Error('Negociação não encontrada');
    }

    const deal = dealRes.rows[0];

    const propertyRes = await this.pool.query(
      `
      SELECT
        id,
        title,
        description,
        price,
        address,
        city,
        status_diligencia,
        score,
        risk_level
      FROM property
      WHERE id = $1
      LIMIT 1
      `,
      [deal.property_id],
    );

    if (propertyRes.rows.length === 0) {
      throw new Error('Imóvel não encontrado');
    }

    const property = propertyRes.rows[0];

    const blockchainReceiptRes = await this.pool.query(
      `
      SELECT *
      FROM deal_blockchain_receipt
      WHERE deal_id = $1
      LIMIT 1
      `,
      [dealId],
    );

    const blockchainReceipt =
      blockchainReceiptRes.rows.length > 0 ? blockchainReceiptRes.rows[0] : null;

    const trustScore = property.score ?? 50;
    const riskLevel = property.risk_level ?? 'HIGH';

    const tokenReference = `IMOB-TT-${dealId}-${Date.now()}`;

    const insertRes = await this.pool.query(
      `
      INSERT INTO trust_token (
        deal_id,
        property_id,
        buyer_user_id,
        seller_user_id,
        trust_score,
        risk_level,
        score_version,
        contract_hash,
        diligence_hash,
        blockchain_receipt_id,
        network,
        token_reference,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, 'v1', $7, NULL, $8, 'polygon', $9, 'ISSUED', NOW(), NOW()
      )
      RETURNING *
      `,
      [
        deal.id,
        deal.property_id,
        deal.buyer_user_id,
        deal.seller_user_id,
        trustScore,
        riskLevel,
        blockchainReceipt?.contract_hash || null,
        blockchainReceipt?.id || null,
        tokenReference,
      ],
    );

    return insertRes.rows[0];
  }

  async getTrustTokenByDealId(dealId: number) {
    const res = await this.pool.query(
      `
      SELECT *
      FROM trust_token
      WHERE deal_id = $1
      LIMIT 1
      `,
      [dealId],
    );

    if (res.rows.length === 0) {
      return null;
    }

    return res.rows[0];
  }
}
