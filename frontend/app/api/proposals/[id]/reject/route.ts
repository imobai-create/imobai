

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await params;
    const proposalId = Number(id);

    if (!Number.isFinite(proposalId)) {
      return NextResponse.json(
        { error: "proposalId inválido" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const proposalRes = await client.query<{
      id: number;
      deal_id: number;
      status: string;
    }>(
      `
      UPDATE proposals
      SET status = 'REJECTED',
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, deal_id, status
      `,
      [proposalId]
    );

    const proposal = proposalRes.rows[0];

    if (!proposal) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    const contractRes = await client.query<{ id: number }>(
      `
      UPDATE contract
      SET status = 'CANCELLED',
          updated_at = NOW()
      WHERE deal_id = $1
        AND type = 'PROPOSTA_COMPRA'
      RETURNING id
      `,
      [proposal.deal_id]
    );

    const contract = contractRes.rows[0];

    if (contract) {
      await client.query(
        `
        INSERT INTO contract_event (contract_id, event_type, payload)
        VALUES ($1, 'CANCELLED', $2)
        `,
        [contract.id, `Proposta ${proposal.id} rejeitada.`]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(
      { ok: true, proposalId: proposal.id, status: proposal.status },
      { status: 200 }
    );
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("POST /api/proposals/[id]/reject error:", e?.message || e);

    return NextResponse.json(
      { error: "Erro interno", detail: e?.message || String(e) },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}