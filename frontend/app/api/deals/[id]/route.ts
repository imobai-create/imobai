
import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const dealId = Number(id);

  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      `
      SELECT
        d.id,
        d."propertyId",
        d."buyerUserId",
        d."sellerUserId",
        d.status,
        d.price,
        d.conditions,
        d.created_at,
        d.updated_at
      FROM deals d
      WHERE d.id = $1
      LIMIT 1
      `,
      [dealId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}




