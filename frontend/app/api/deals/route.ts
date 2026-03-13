import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const propertyId = Number(body?.propertyId);
    const buyerId = Number(body?.buyerId);
    const sellerId = Number(body?.sellerId);
    const price = Number(body?.price ?? 0);

    if (
      !Number.isFinite(propertyId) ||
      !Number.isFinite(buyerId) ||
      !Number.isFinite(sellerId)
    ) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const inserted = await pool.query(
      `
      INSERT INTO deal ("propertyId", "buyerId", "sellerId", price)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [propertyId, buyerId, sellerId, price]
    );

    return NextResponse.json(
      { dealId: inserted.rows[0].id },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/deals error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}


