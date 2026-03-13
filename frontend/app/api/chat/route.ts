
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const dealId = Number(req.nextUrl.searchParams.get("dealId"));

  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "dealId inválido" }, { status: 400 });
  }

  

const res = await pool.query(
  `  
SELECT
      id,
      deal_id,
      sender_user_id,
      sender_name,
      message,
      "createdAt" as created_at
    FROM deal_message
    WHERE deal_id = $1
    ORDER BY "createdAt" ASC
  `,
  [dealId]
);
 

  return NextResponse.json(res.rows);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const dealId = Number(body.dealId);
    const message = String(body.message ?? "").trim();
    const senderName = body.sender ?? "Participante";

    if (!message) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    // ⚠️ IMPORTANTE
    // vamos usar temporariamente o usuário 1
    // depois conectaremos ao login real

    const senderUserId = 1;

    const res = await pool.query(
      `
      INSERT INTO deal_message
      (deal_id, message, sender_name, sender_user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [dealId, message, senderName, senderUserId]
    );

    return NextResponse.json(res.rows[0]);
  } catch (error: any) {
    console.error("chat error:", error);

    return NextResponse.json(
      {
        error: "Erro interno",
        details: error.message,
      },
      { status: 500 }
    );
  }
}