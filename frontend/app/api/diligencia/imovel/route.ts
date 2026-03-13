import { NextResponse } from "next/server"
import  pool  from "@/lib/db"

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id, title, description, price, address, image, "userId",
        status_diligencia, "createdAt", "updatedAt"
      FROM property
      ORDER BY id DESC
    `)

    const data = result.rows.map((row: any) => ({ ...row, url: row.image }))
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("GET /api/imoveis:", error)
    return NextResponse.json({ error: "Erro ao buscar imóveis" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, price, address, url } = body

    if (!title || !description || !price || !address || !url) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      )
    }

    // MOCK até ter login
    const userId = 1

    const result = await pool.query(
      `
      INSERT INTO property
        (title, description, price, address, image, status_diligencia, "userId")
      VALUES
        ($1, $2, $3, $4, $5, 'PENDENTE', $6)
      RETURNING
        id, title, description, price, address, image, "userId",
        status_diligencia, "createdAt", "updatedAt"
      `,
      [title, description, price, address, url, userId]
    )

    const created = result.rows[0]
    return NextResponse.json({ ...created, url: created.image }, { status: 201 })
  } catch (error) {
    console.error("POST /api/imoveis:", error)
    return NextResponse.json({ error: "Erro ao criar imóvel" }, { status: 500 })
  }
}

