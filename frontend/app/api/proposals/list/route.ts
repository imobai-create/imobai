


import { NextResponse } from "next/server";
import  pool  from "@/lib/db"; // ajuste

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dealId = Number(searchParams.get("dealId"));

    if (!Number.isFinite(dealId)) {
      return NextResponse.json({ error: "dealId inválido" }, { status: 400 });
    }

    const rows = await pool.query(
      `SELECT id, deal_id, user_id, price, conditions, status, created_at
       FROM proposals
       WHERE deal_id = $1
       ORDER BY id DESC`,
      [dealId]
    );

    return NextResponse.json(rows.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erro" }, { status: 500 });
  }
}