

import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { Pool } from 'pg';

@Injectable()
export class BlockchainService {
  private pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'imobai_db',
  });

  generateHash(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  async createReceipt(dealId: number) {
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
        city
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

    const contractText = `
IMOBAI TRANSACTION RECEIPT

Deal ID: ${deal.id}
Property ID: ${property.id}
Property Title: ${property.title}
Description: ${property.description}
Address: ${property.address}
City: ${property.city}

Buyer User ID: ${deal.buyer_user_id}
Seller User ID: ${deal.seller_user_id}

Negotiated Price: ${deal.price}
Deal Status: ${deal.status}

Timestamp: ${new Date().toISOString()}
    `.trim();

    const contractHash = this.generateHash(contractText);

    const existingRes = await this.pool.query(
      `
      SELECT *
      FROM deal_blockchain_receipt
      WHERE deal_id = $1
      LIMIT 1
      `,
      [dealId],
    );

    if (existingRes.rows.length > 0) {
      return existingRes.rows[0];
    }

    const insertRes = await this.pool.query(
      `
      INSERT INTO deal_blockchain_receipt (
        deal_id,
        property_id,
        buyer_user_id,
        seller_user_id,
        contract_text,
        contract_hash,
        blockchain_network,
        tx_hash,
        wallet_address,
        status,
        created_at,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, 'polygon', NULL, NULL, 'PENDING', NOW(), NOW()
      )
      RETURNING *
      `,
      [
        deal.id,
        deal.property_id,
        deal.buyer_user_id,
        deal.seller_user_id,
        contractText,
        contractHash,
      ],
    );

    return insertRes.rows[0];
  }

  async getReceiptByDealId(dealId: number) {
    const res = await this.pool.query(
      `
      SELECT *
      FROM deal_blockchain_receipt
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





