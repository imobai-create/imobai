import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {

    const { dealId, propertyId, amount } = await req.json()

    const d = Number(dealId)
    const p = Number(propertyId)
    const a = Number(amount)

    if (!Number.isFinite(d) || !Number.isFinite(p) || !Number.isFinite(a)) {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      )
    }

    const existing = await pool.query(
      `
      SELECT id
      FROM transactions
      WHERE "dealId" = $1
      AND type = 'ESCROW'
      LIMIT 1
      `,
      [d]
    )

    if (existing.rows[0]) {
      return NextResponse.json({
        transactionId: existing.rows[0].id,
        reused: true
      })
    }

    const r = await pool.query(
      `
      INSERT INTO transactions
      (
        amount,
        type,
        status,
        "dealId",
        "propertyId",
        "escrowWallet",
        "blockchainHash",
        "txHash"
      )
      VALUES
      (
        $1,
        'ESCROW',
        'ESCROW',
        $2,
        $3,
        NULL,
        NULL,
        NULL
      )
      RETURNING id
      `,
      [a, d, p]
    )

    return NextResponse.json({
      transactionId: r.rows[0].id,
      reused: false
    })

  } catch (e: any) {

    return NextResponse.json(
      { error: e.message || "Erro" },
      { status: 500 }
    )

  }
}







