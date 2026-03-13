import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dealId = Number(body.dealId);
    const role = String(body.role ?? "");

    if (!Number.isFinite(dealId) || (role !== "buyer" && role !== "seller")) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (role === "buyer") {
      await pool.query(
        `UPDATE deal_contract SET buyer_signed = true WHERE deal_id = $1`,
        [dealId]
      );
    } else {
      await pool.query(
        `UPDATE deal_contract SET seller_signed = true WHERE deal_id = $1`,
        [dealId]
      );
    }

    // se ambos assinados -> signed=true, signed_at=now
    await pool.query(
      `
      UPDATE deal_contract
      SET signed = (buyer_signed AND seller_signed),
          signed_at = CASE WHEN (buyer_signed AND seller_signed) THEN NOW() ELSE signed_at END
      WHERE deal_id = $1
      `,
      [dealId]
    );

    const { rows } = await pool.query(
      `SELECT deal_id, signed, signed_at, buyer_signed, seller_signed, contract_hash FROM deal_contract WHERE deal_id=$1`,
      [dealId]
    );

    return NextResponse.json(rows[0] ?? { ok: true });
  } catch (e) {
    console.error("/api/contract/sign error:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}







