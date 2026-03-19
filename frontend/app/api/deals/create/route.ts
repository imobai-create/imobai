

import { NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/db";

type Body = {
  propertyId: number;
  buyerId: number;
  sellerId: number;
  price: number;
};

function buildIntermediacaoContent(params: {
  contractIdPlaceholder: string;
  dealId: number;
  propertyId: number;
  propertyTitle: string;
  propertyAddress: string;
  buyerName: string;
  sellerName: string;
  buyerDocument?: string | null;
  sellerDocument?: string | null;
  acceptedAt: string;
  contractHash: string;
}) {
  return `
CONTRATO DE INTERMEDIAÇÃO DIGITAL IMOBAI

VENDEDOR: ${params.sellerName}${params.sellerDocument ? `, documento ${params.sellerDocument}` : ""}
COMPRADOR: ${params.buyerName}${params.buyerDocument ? `, documento ${params.buyerDocument}` : ""}
PLATAFORMA: IMOBAI

CLÁUSULA 1 — OBJETO
1.1. O presente contrato tem por objeto a intermediação digital da negociação referente ao imóvel identificado na plataforma IMOBAI como:
Imóvel: ${params.propertyTitle}
Endereço: ${params.propertyAddress}
ID do imóvel: ${params.propertyId}

CLÁUSULA 2 — NATUREZA DA PLATAFORMA
2.1. A IMOBAI atua como plataforma digital de intermediação e organização da negociação, disponibilizando infraestrutura para aproximação entre as partes, comunicação, diligência, score e registros digitais.

CLÁUSULA 3 — DECLARAÇÕES DAS PARTES
3.1. O vendedor declara possuir legitimidade para ofertar o imóvel.
3.2. O comprador declara utilizar a plataforma de boa-fé.

CLÁUSULA 4 — ACEITE DIGITAL
4.1. As partes reconhecem a validade dos aceites digitais e dos registros técnicos mantidos pela plataforma IMOBAI.

CLÁUSULA 5 — REGISTROS E RASTREABILIDADE
5.1. A negociação poderá ser acompanhada de score, classificação de risco, trust token, hash documental e demais registros digitais.

CLÁUSULA 6 — VIGÊNCIA
6.1. Este contrato entra em vigor na data do aceite digital e permanece válido enquanto a negociação estiver ativa na plataforma.

Data do aceite: ${params.acceptedAt}
ID da negociação: ${params.dealId}
ID do contrato: ${params.contractIdPlaceholder}
Hash do contrato: ${params.contractHash}
`.trim();
}

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const body = (await req.json()) as Partial<Body>;

    const propertyId = Number(body.propertyId);
    const buyerId = Number(body.buyerId);
    const sellerId = Number(body.sellerId);
    const price = Number(body.price);

    if (![propertyId, buyerId, sellerId, price].every(Number.isFinite)) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // 1) Se já existir deal aberto para esse imóvel/comprador/vendedor, reutiliza
    const existingDealRes = await client.query<{ id: number }>(
      `
      SELECT id
      FROM deal
      WHERE property_id = $1
        AND buyer_user_id = $2
        AND seller_user_id = $3
      ORDER BY id DESC
      LIMIT 1
      `,
      [propertyId, buyerId, sellerId]
    );

    let dealId: number;

    if (existingDealRes.rows.length > 0) {
      dealId = existingDealRes.rows[0].id;
    } else {
      const insertedDealRes = await client.query<{ id: number }>(
        `
        INSERT INTO deal (
          property_id,
          buyer_user_id,
          seller_user_id,
          price,
          status
        )
        VALUES ($1, $2, $3, $4, 'OPEN')
        RETURNING id
        `,
        [propertyId, buyerId, sellerId, price]
      );

      dealId = insertedDealRes.rows[0].id;
    }

    // 2) Se já existir contrato de intermediação nesse deal, retorna ele
    const existingContractRes = await client.query<{ id: number }>(
      `
      SELECT id
      FROM contract
      WHERE deal_id = $1
        AND type = 'INTERMEDIACAO_DIGITAL'
      ORDER BY id DESC
      LIMIT 1
      `,
      [dealId]
    );

    if (existingContractRes.rows.length > 0) {
      await client.query("COMMIT");
      return NextResponse.json(
        {
          dealId,
          contractId: existingContractRes.rows[0].id,
        },
        { status: 200 }
      );
    }

    // 3) Buscar dados do imóvel
    const propertyRes = await client.query<{
      id: number;
      title: string | null;
      address: string | null;
    }>(
      `
      SELECT id, title, address
      FROM property
      WHERE id = $1
      LIMIT 1
      `,
      [propertyId]
    );

    const property = propertyRes.rows[0];

    if (!property) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }

    // 4) Dados mínimos das partes (temporários no MVP)
    const buyerName = `Comprador #${buyerId}`;
    const sellerName = `Vendedor #${sellerId}`;
    const acceptedAt = new Date().toISOString();

    // 5) Gerar conteúdo + hash
    const contentWithoutId = buildIntermediacaoContent({
      contractIdPlaceholder: "PENDENTE",
      dealId,
      propertyId,
      propertyTitle: property.title ?? `Imóvel #${propertyId}`,
      propertyAddress: property.address ?? "Endereço não informado",
      buyerName,
      sellerName,
      acceptedAt,
      contractHash: "PENDENTE",
    });

    const draftHash = crypto
      .createHash("sha256")
      .update(contentWithoutId)
      .digest("hex");

    const finalContent = buildIntermediacaoContent({
      contractIdPlaceholder: "PENDENTE",
      dealId,
      propertyId,
      propertyTitle: property.title ?? `Imóvel #${propertyId}`,
      propertyAddress: property.address ?? "Endereço não informado",
      buyerName,
      sellerName,
      acceptedAt,
      contractHash: draftHash,
    });

    // 6) Inserir contrato
    const contractRes = await client.query<{ id: number }>(
      `
      INSERT INTO contract (
        deal_id,
        property_id,
        type,
        version,
        title,
        content,
        hash,
        status
      )
      VALUES (
        $1,
        $2,
        'INTERMEDIACAO_DIGITAL',
        1,
        'Contrato de Intermediação Digital IMOBAI',
        $3,
        $4,
        'GENERATED'
      )
      RETURNING id
      `,
      [dealId, propertyId, finalContent, draftHash]
    );

    const contractId = contractRes.rows[0].id;

    // 7) Inserir partes
    await client.query(
      `
      INSERT INTO contract_party (contract_id, role, name)
      VALUES
        ($1, 'BUYER', $2),
        ($1, 'SELLER', $3),
        ($1, 'PLATFORM', 'IMOBAI')
      `,
      [contractId, buyerName, sellerName]
    );

    // 8) Inserir evento
    await client.query(
      `
      INSERT INTO contract_event (contract_id, event_type, payload)
      VALUES ($1, 'CREATED', $2)
      `,
      [
        contractId,
        `Contrato de intermediação gerado automaticamente para o deal ${dealId}.`,
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json(
      {
        dealId,
        contractId,
      },
      { status: 200 }
    );
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("POST /api/deals/create error:", e?.message || e);

    return NextResponse.json(
      {
        error: "Erro interno",
        detail: e?.message || String(e),
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}



