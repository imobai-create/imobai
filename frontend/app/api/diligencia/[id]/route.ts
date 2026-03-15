
import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, context: Params) {
  const { id } = await context.params;
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
      `,
      [diligenciaId]
    );

    return NextResponse.json(res.rows[0] || null);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "database error" }, { status: 500 });
  }
}


