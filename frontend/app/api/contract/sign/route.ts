


import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const body = await req.json();
    const contractId = Number(body.contractId);
    const userId = Number(body.userId || 1);

    if (!Number.isFinite(contractId)) {
      return NextResponse.json(
        { error: "contractId inválido" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const contractRes = await client.query<{
      id: number;
      type: string;
      status: string;
    }>(
      `
      UPDATE contract
      SET status = 'SIGNED',
          signed_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, type, status
      `,
      [contractId]
    );

    const contract = contractRes.rows[0];

    if (!contract) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Contrato não encontrado" },
        { status: 404 }
      );
    }

    await client.query(
      `
      INSERT INTO contract_event (contract_id, event_type, payload)
      VALUES ($1, 'SIGNED', $2)
      `,
      [contract.id, `Assinado por usuário ${userId}`]
    );

    await client.query("COMMIT");

    return NextResponse.json(
      { ok: true, contractId: contract.id, status: contract.status },
      { status: 200 }
    );
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("POST /api/contract/sign error:", e?.message || e);

    return NextResponse.json(
      { error: "Erro interno", detail: e?.message || String(e) },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

