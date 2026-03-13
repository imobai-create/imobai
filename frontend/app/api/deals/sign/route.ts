


import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { dealId } = await req.json();
    const id = Number(dealId);

    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "dealId inválido" }, { status: 400 });
    }

    // upsert
    await pool.query(
      `
      INSERT INTO deal_contract (deal_id, signed, signed_at)
      VALUES ($1, true, now())
      ON CONFLICT (deal_id)
      DO UPDATE SET signed = true, signed_at = now()
      `,
      [id]
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro" }, { status: 500 });
  }
}