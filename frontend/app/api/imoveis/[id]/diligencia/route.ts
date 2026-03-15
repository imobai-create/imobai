

import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const propertyId = Number(id);

  if (!Number.isFinite(propertyId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status, notes } = body;

    const res = await pool.query(
      `
      UPDATE diligencia
      SET
        status = $1,
        notes = $2,
        updated_at = now()
      WHERE property_id = $3
      RETURNING *
      `,
      [status, notes, propertyId]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Diligencia not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error("Error updating diligencia:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


