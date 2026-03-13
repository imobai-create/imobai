import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { dealId, senderUserId, value, message } = body;

    const result = await pool.query(
      `
      INSERT INTO proposals (deal_id, sender_user_id, value, message)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [dealId, senderUserId, value, message]
    );

    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao criar proposta" },
      { status: 500 }
    );
  }
}