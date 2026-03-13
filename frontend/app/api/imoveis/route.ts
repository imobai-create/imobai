
import { NextResponse } from "next/server";
import pool from "@/lib/db";

type PropertyRow = {
  id: number;
  title: string;
  description: string;
  price: string | number;
  address: string;
  userId: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  status_diligencia: string;
};

export async function GET() {
  try {
    const { rows } = await pool.query<PropertyRow>(`
      SELECT
        id,
        title,
        description,
        price,
        address,
        "userId",
        image,
        "createdAt",
        "updatedAt",
        status_diligencia
      FROM property
      ORDER BY id DESC
    `);

    // compat pro front: url = image
    const data = rows.map((r) => ({
      ...r,
      url: r.image ?? null,
    }));

    return NextResponse.json(data);
  } catch (e) {
    console.error("GET /api/imoveis error:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = body.title ?? body.titulo;
    const description = body.description ?? body.descricao;
    const price = body.price ?? body.preco;
    const address = body.address ?? body.cidade ?? body.endereco;
    const image = body.image ?? body.url ?? null;

    // MVP: user fixo (até login existir)
    const userId = Number(body.userId ?? 1);

    if (!title || !description || !price || !address) {
      return NextResponse.json(
        { error: "Campos obrigatórios: title, description, price, address" },
        { status: 400 }
      );
    }

    const { rows } = await pool.query<PropertyRow>(
      `
      INSERT INTO property
        (title, description, price, address, image, "userId", status_diligencia, "createdAt", "updatedAt")
      VALUES
        ($1, $2, $3, $4, $5, $6, 'PENDENTE', NOW(), NOW())
      RETURNING
        id, title, description, price, address, "userId", image, "createdAt", "updatedAt", status_diligencia
      `,
      [title, description, price, address, image, userId]
    );

    const created = rows[0];
    return NextResponse.json({ ...created, url: created.image ?? null }, { status: 201 });
  } catch (e) {
    console.error("POST /api/imoveis error:", e);
    return NextResponse.json({ error: "Erro ao criar imóvel" }, { status: 500 });
  }
}




