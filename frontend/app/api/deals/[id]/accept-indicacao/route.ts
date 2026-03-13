
import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const dealId = Number(id);
  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      `UPDATE deal
       SET "indicacaoAccepted" = true, "updatedAt" = now()
       WHERE id = $1
       RETURNING id, "indicacaoAccepted"`,
      [dealId]
    );

    if (res.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, deal: res.rows[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}