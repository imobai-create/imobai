


import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dealId = Number(body.dealId);
    const senderUserId = Number(body.senderUserId ?? 1);
    const message = String(body.message ?? "").trim();

    if (!Number.isFinite(dealId) || !Number.isFinite(senderUserId) || !message) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO deal_message (deal_id, sender_user_id, message, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [dealId, senderUserId, message]
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("POST /api/chat/send erro:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}






