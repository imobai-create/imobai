
import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const propertyId = Number(id);

  if (!Number.isFinite(propertyId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      `
      SELECT
        id,
        property_id,
        status,
        notes,
        created_at,
        updated_at
      FROM diligencia
      WHERE property_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT 1
      `,
      [propertyId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Diligencia not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Error fetching diligencia:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
