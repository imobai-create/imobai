
import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const dealId = Number(id);
  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      `SELECT
        d.id,
        d."propertyId",
        d."buyerUserId",
        d."sellerUserId",
        d.status,
        d."indicacaoAccepted",
        d."escrowStatus",
        d."amountCents",
        p.title,
        p.address,
        p.price,
        p.image
      FROM deal d
      JOIN property p ON p.id = d."propertyId"
      WHERE d.id = $1
      LIMIT 1`,
      [dealId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ deal: res.rows[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}