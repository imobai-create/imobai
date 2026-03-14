import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = {
  params: {
    dealId: string;
  };
};

export async function GET(_: Request, ctx: Ctx) {
  const { dealId } = ctx.params;
  const numericDealId = Number(dealId);

  if (!Number.isFinite(numericDealId)) {
    return NextResponse.json({ error: "Invalid dealId" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      `
      SELECT
        id,
        property_id,
        token_reference,
        trust_score,
        risk_level,
        network,
        contract_hash,
        created_at
      FROM trust_token
      WHERE deal_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT 1
      `,
      [numericDealId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Trust token not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Error fetching trust token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

