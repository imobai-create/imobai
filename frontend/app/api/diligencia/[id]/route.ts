
import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  const propertyId = Number(params.id)

  if (!Number.isFinite(propertyId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 })
  }

  const res = await pool.query(
    `
    SELECT tipo, status, detalhes, impacto_score
    FROM diligencias
    WHERE property_id = $1
    `,
    [propertyId]
  )

  return NextResponse.json(res.rows)
}

