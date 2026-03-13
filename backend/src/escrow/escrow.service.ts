

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

@Injectable()
export class EscrowService {

  async createEscrow(dealId: number) {

    const deal = await pool.query(`
      SELECT
        id,
        buyer_user_id,
        seller_user_id,
        price
      FROM deal
      WHERE id = $1
    `, [dealId]);

    if (deal.rows.length === 0) {
      throw new Error('Deal não encontrado');
    }

    const d = deal.rows[0];

    const escrow = await pool.query(`
      INSERT INTO escrow_transaction (
        deal_id,
        buyer_user_id,
        seller_user_id,
        amount
      )
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (deal_id) DO NOTHING
      RETURNING *
    `,
    [
      dealId,
      d.buyer_user_id,
      d.seller_user_id,
      d.price
    ]);

    return escrow.rows[0];
  }

  async deposit(dealId: number) {

    const escrow = await pool.query(`
      UPDATE escrow_transaction
      SET status = 'FUNDS_LOCKED',
          updated_at = NOW()
      WHERE deal_id = $1
      RETURNING *
    `,[dealId]);

    return escrow.rows[0];
  }

  async release(dealId: number) {

    const escrow = await pool.query(`
      UPDATE escrow_transaction
      SET status = 'RELEASED',
          updated_at = NOW()
      WHERE deal_id = $1
      RETURNING *
    `,[dealId]);

    return escrow.rows[0];
  }

  async refund(dealId: number) {

    const escrow = await pool.query(`
      UPDATE escrow_transaction
      SET status = 'REFUNDED',
          updated_at = NOW()
      WHERE deal_id = $1
      RETURNING *
    `,[dealId]);

    return escrow.rows[0];
  }

}

