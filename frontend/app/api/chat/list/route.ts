import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dealId = Number(searchParams.get("dealId"));

  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "dealId inválido" }, { status: 400 });
  }

  const r = await pool.query(
    `
    SELECT id, deal_id, sender_user_id, message, created_at
    FROM deal_message
    WHERE deal_id = $1
    ORDER BY id ASC
    LIMIT 200
    `,
    [dealId]
  );

  return NextResponse.json({ messages: r.rows });
}

