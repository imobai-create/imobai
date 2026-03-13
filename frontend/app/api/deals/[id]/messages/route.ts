
import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

function containsContactAttempt(text: string): boolean {
  const t = (text || "").toLowerCase();

  // e-mail
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(t)) return true;

  // telefone (simplão) +55, 11 9xxxx-xxxx etc.
  if (/\b(\+?55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-\s]?\d{4}\b/.test(t)) return true;

  // palavras comuns
  if (t.includes("whats") || t.includes("whatsapp") || t.includes("instagram") || t.includes("@")) return true;

  return false;
}

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const dealId = Number(id);
  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      `SELECT id, deal_id, sender_user_id, message, created_at
       FROM deal_message
       WHERE deal_id = $1
       ORDER BY id ASC`,
      [dealId]
    );

    return NextResponse.json({ items: res.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const dealId = Number(id);
  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const senderUserId = Number(body?.senderUserId ?? 1);
    const message = String(body?.message ?? "").trim();

    if (!message) return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    if (!Number.isFinite(senderUserId)) return NextResponse.json({ error: "senderUserId inválido" }, { status: 400 });

    // verifica se a indicação foi aceita
    const dRes = await pool.query(
      `SELECT "indicacaoAccepted" FROM deal WHERE id = $1 LIMIT 1`,
      [dealId]
    );
    if (dRes.rowCount === 0) return NextResponse.json({ error: "Deal não existe" }, { status: 404 });

    const indicacaoAccepted = Boolean(dRes.rows[0].indicacaoAccepted);

    if (!indicacaoAccepted && containsContactAttempt(message)) {
      return NextResponse.json(
        { error: "Contato bloqueado até assinatura do contrato de indicação." },
        { status: 403 }
      );
    }

    const ins = await pool.query(
      `INSERT INTO deal_message (deal_id, sender_user_id, message)
       VALUES ($1, $2, $3)
       RETURNING id, deal_id, sender_user_id, message, created_at`,
      [dealId, senderUserId, message]
    );

    return NextResponse.json({ item: ins.rows[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}