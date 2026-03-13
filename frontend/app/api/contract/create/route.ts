import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sha256 } from "@/lib/hash";
import { renderContratoIndicacao } from "@/lib/indicacao";

type DealRow = {
  id: number;
  propertyId: number;
  price: string | number;
  property_title: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const dealId = Number(body.dealId);

    if (!Number.isFinite(dealId)) {
      return NextResponse.json({ error: "dealId inválido" }, { status: 400 });
    }

    const { rows } = await pool.query<DealRow>(
      `
      SELECT
        d.id,
        d."propertyId" as "propertyId",
        d.price,
        p.title as property_title
      FROM deal d
      JOIN property p ON p.id = d."propertyId"
      WHERE d.id = $1
      LIMIT 1
      `,
      [dealId]
    );

    const deal = rows[0];
    if (!deal) {
      return NextResponse.json({ error: "Deal não encontrado" }, { status: 404 });
    }

    const priceBRL = Number(deal.price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const contractText = renderContratoIndicacao({
      dealId: deal.id,
      propertyId: deal.propertyId,
      propertyTitle: deal.property_title ?? "Imóvel",
      priceBRL,
    });

    const contractHash = sha256(contractText);

    // UPSERT
    await pool.query(
      `
      INSERT INTO deal_contract (deal_id, signed, signed_at, buyer_signed, seller_signed, contract_hash, contract_text)
      VALUES ($1, false, NULL, false, false, $2, $3)
      ON CONFLICT (deal_id) DO UPDATE
      SET contract_hash = EXCLUDED.contract_hash,
          contract_text = EXCLUDED.contract_text
      `,
      [dealId, contractHash, contractText]
    );

    return NextResponse.json({
      dealId,
      contract_hash: contractHash,
      contract_text: contractText,
      buyer_signed: false,
      seller_signed: false,
      signed: false,
    });
  } catch (e) {
    console.error("/api/contract/create error:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}



