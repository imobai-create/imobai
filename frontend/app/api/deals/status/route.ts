import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dealId = Number(searchParams.get("dealId"));

  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "dealId inválido" }, { status: 400 });
  }

  // MVP: status do contrato de indicação fica numa tabela simples "deal_contract"
  // Se você não tiver, vamos criar.
  const r = await pool.query(
    `SELECT signed FROM deal_contract WHERE deal_id = $1 LIMIT 1`,
    [dealId]
  );

  return NextResponse.json({ signed: r.rows[0]?.signed === true });
}
