import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const propertyId = Number(id);

    if (!Number.isFinite(propertyId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const { rows } = await pool.query(
      `
      SELECT
        id,
        title,
        description,
        price,
        address,
        "userId",
        image,
        "createdAt",
        "updatedAt",
        status_diligencia
      FROM property
      WHERE id = $1
      LIMIT 1
      `,
      [propertyId]
    );

    if (!rows[0]) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 });
    }

    const row = rows[0];

    return NextResponse.json({
      ...row,
      url: row.image ? `/uploads/${row.image}` : null,
    });
  } catch (error) {
    console.error("GET /api/imoveis/[id] error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

