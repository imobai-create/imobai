

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params;

  if (!tokenId?.trim()) {
    return NextResponse.json(
      { error: "Invalid tokenId" },
      { status: 400 }
    );
  }

  try {
    const res = await pool.query(
      `
      SELECT
        id,
        property_id,
        deal_id,
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
        { error: "Trust token not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Error fetching public trust token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



