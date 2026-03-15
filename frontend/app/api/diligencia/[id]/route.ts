

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const diligenciaId = Number(id);

  if (!Number.isFinite(diligenciaId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const res = await pool.query(
      `
      SELECT *
      FROM diligencias
      WHERE id = $1
      LIMIT 1
      `,
      [diligenciaId]
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





