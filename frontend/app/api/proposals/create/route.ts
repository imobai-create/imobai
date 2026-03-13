import { NextResponse } from "next/server";
import pool  from "@/lib/db"; // ajuste se seu pool estiver em outro caminho

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dealId, userId, price, conditions } = body;

    const deal_id = Number(dealId);
    const user_id = Number(userId);
    const p = Number(price);

    if (!Number.isFinite(deal_id) || !Number.isFinite(user_id) || !Number.isFinite(p)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const inserted = await pool.query(
      `INSERT INTO proposals (deal_id, user_id, price, conditions, status)
       VALUES ($1, $2, $3, $4, 'PENDING')
       RETURNING id, deal_id, user_id, price, conditions, status, created_at`,
      [deal_id, user_id, p, conditions ?? null]
    );

    return NextResponse.json(inserted.rows[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erro" }, { status: 500 });
  }
}