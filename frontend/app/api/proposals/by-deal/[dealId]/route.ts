

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  try {
    const { dealId } = await params;
    const numericDealId = Number(dealId);

    if (!Number.isFinite(numericDealId)) {
      return NextResponse.json(
        { error: "dealId inválido" },
        { status: 400 }
      );
    }

    const res = await pool.query(
      `
      SELECT *
      FROM proposals
      WHERE deal_id = $1
      ORDER BY id DESC
      LIMIT 1
      `,
      [numericDealId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0], { status: 200 });
  } catch (e: any) {
    console.error("GET /api/proposals/by-deal error:", e?.message || e);

    return NextResponse.json(
      { error: "Erro interno", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}




