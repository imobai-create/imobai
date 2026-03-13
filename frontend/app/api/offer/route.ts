import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {

  const dealId = Number(req.nextUrl.searchParams.get("dealId"));

  if (!Number.isFinite(dealId)) {
    return NextResponse.json({ error: "dealId inválido" }, { status: 400 });
  }

  const res = await pool.query(`
    SELECT *
    FROM deal_offer
    WHERE deal_id = $1
    ORDER BY created_at DESC
  `,[dealId]);

  return NextResponse.json(res.rows);
}


export async function POST(req: NextRequest) {

  const body = await req.json();

  const dealId = Number(body.dealId);
  const buyerId = Number(body.buyerId);
  const sellerId = Number(body.sellerId);
  const value = Number(body.value);
  const message = body.message ?? "";

  if(!Number.isFinite(value)){
    return NextResponse.json({error:"Valor inválido"}, {status:400});
  }

  const res = await pool.query(`
    INSERT INTO deal_offer
    (deal_id,buyer_id,seller_id,offer_value,message)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `,[dealId,buyerId,sellerId,value,message]);

  return NextResponse.json(res.rows[0]);
}