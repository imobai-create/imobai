import { NextResponse } from "next/server"
import  pool  from "@/lib/db"

type Params = { params: { id: string } }

const ALLOWED = new Set(["APROVADO", "REPROVADO", "PENDENTE"])

export async function PATCH(req: Request, { params }: Params) {
  try {
    const id = Number(params.id)
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const body = await req.json()
    const { status_diligencia } = body

    if (!status_diligencia || !ALLOWED.has(status_diligencia)) {
      return NextResponse.json(
        { error: "status_diligencia inválido (APROVADO | REPROVADO | PENDENTE)" },
        { status: 400 }
      )
    }

    const result = await pool.query(
      `
      UPDATE property
      SET status_diligencia = $1, "updatedAt" = NOW()
      WHERE id = $2
      RETURNING
        id, title, description, price, address, image, "userId",
        status_diligencia, "createdAt", "updatedAt"
      `,
      [status_diligencia, id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Imóvel não encontrado" }, { status: 404 })
    }

    const updated = result.rows[0]
    return NextResponse.json({ ...updated, url: updated.image }, { status: 200 })
  } catch (error) {
    console.error("PATCH /api/imoveis/[id]/diligencia:", error)
    return NextResponse.json({ error: "Erro ao atualizar diligência" }, { status: 500 })
  }
}