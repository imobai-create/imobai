import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Body = {
  propertyId: number;
  buyerId: number;
  sellerId: number;
  price: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Body>;
    const propertyId = Number(body.propertyId);
    const buyerId = Number(body.buyerId);
    const sellerId = Number(body.sellerId);
    const price = Number(body.price);

    if (![propertyId, buyerId, sellerId, price].every((n) => Number.isFinite(n))) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Ajuste o nome da tabela aqui se no seu banco ela for "deals" e não "deal".
    
const { rows } = await pool.query<{ id: number }>(
  `
    INSERT INTO deal ("propertyId", "buyerId", "sellerId", price, status)
    VALUES ($1, $2, $3, $4, 'OPEN')
    RETURNING id
  `,
  [propertyId, buyerId, sellerId, price]
);

    return NextResponse.json({ dealId: rows[0].id }, { status: 200 });
  } catch (e: any) {
    console.error("POST /api/deals/create error:", e?.message || e);
    return NextResponse.json(
      { error: "Erro interno", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}