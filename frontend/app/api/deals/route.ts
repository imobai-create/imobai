

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const propertyId = Number(body.propertyId);
    const buyerId = Number(body.buyerId);
    const sellerId = Number(body.sellerId);
    const price = Number(body.price ?? 0);

    if (!Number.isFinite(propertyId)) {
      return NextResponse.json(
        { error: "propertyId inválido" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(buyerId)) {
      return NextResponse.json(
        { error: "buyerId inválido" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(sellerId)) {
      return NextResponse.json(
        { error: "sellerId inválido" },
        { status: 400 }
      );
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM deal
      WHERE property_id = $1
        AND buyer_user_id = $2
        AND seller_user_id = $3
      ORDER BY id DESC
      LIMIT 1
      `,
      [propertyId, buyerId, sellerId]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { dealId: existing.rows[0].id },
        { status: 200 }
      );
    }

    const inserted = await pool.query(
      `
      INSERT INTO deal (
        property_id,
        buyer_user_id,
        seller_user_id,
        price,
        status
      )
      VALUES ($1, $2, $3, $4, 'OPEN')
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
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}