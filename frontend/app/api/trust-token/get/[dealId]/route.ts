
import { NextResponse } from 'next/server'
import pool from '../../../../../lib/db'

export async function GET(
  req: Request,
  { params }: { params: { dealId: string } }
) {
  try {
    const dealId = Number(params.dealId)

    const res = await pool.query(
      `
      SELECT *
      FROM trust_token
      WHERE deal_id = $1
      LIMIT 1
      `,
      [dealId]
    )

    if (res.rows.length === 0) {
      return NextResponse.json({ token: null })
    }

    return NextResponse.json(res.rows[0])
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Erro ao buscar Trust Token' },
      { status: 500 }
    )
  }
}



