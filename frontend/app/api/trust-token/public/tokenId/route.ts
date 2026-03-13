
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { tokenId: string } }
) {
  try {
    const { tokenId } = params;

    const res = await pool.query(
      `
      SELECT
        id,
        token_reference,
        trust_score,
        risk_level,
        network,
        contract_hash,
        created_at
      FROM trust_token
      WHERE token_reference = $1
      LIMIT 1
      `,
      [tokenId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Token não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

