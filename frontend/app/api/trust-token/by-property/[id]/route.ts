import { NextResponse } from 'next/server'
import pool from '../../../../../lib/db'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  const propertyId = Number(params.id)

  const res = await pool.query(
    `
    SELECT
      token_reference,
      trust_score,
      risk_level,
      network
    FROM trust_token
    WHERE property_id = $1
    LIMIT 1
    `,
    [propertyId]
  )

  if (!res.rows.length) {
    return NextResponse.json(null)
  }

  return NextResponse.json(res.rows[0])
}

