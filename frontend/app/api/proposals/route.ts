import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { dealId, userId, price, conditions } = body

    const result = await pool.query(
      `
      INSERT INTO proposals (deal_id, user_id, price, conditions)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [dealId, userId, price, conditions]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro ao criar proposta" }, { status: 500 })
  }
}