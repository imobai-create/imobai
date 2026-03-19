


import { NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/db";

type Body = {
  dealId: number;
  offerPrice: number;
  paymentTerms?: string;
  validUntil?: string;
};

function buildPropostaCompraContent(params: {
  proposalIdPlaceholder: string;
  dealId: number;
  propertyId: number;
  propertyTitle: string;
  propertyAddress: string;
  buyerName: string;
  sellerName: string;
  offerPrice: number;
  paymentTerms: string;
  validUntil: string;
  proposalHash: string;
  createdAt: string;
}) {
  const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(params.offerPrice);

  return `
PROPOSTA DE COMPRA IMOBAI

PROPONENTE / COMPRADOR: ${params.buyerName}
VENDEDOR: ${params.sellerName}

IMÓVEL:
${params.propertyTitle}
${params.propertyAddress}
ID do imóvel: ${params.propertyId}

CLÁUSULA 1 — OBJETO
1.1. O comprador acima identificado apresenta proposta formal de compra do imóvel identificado neste instrumento.

CLÁUSULA 2 — VALOR
2.1. O valor ofertado é de ${brl}.

CLÁUSULA 3 — CONDIÇÕES DE PAGAMENTO
3.1. A proposta considera as seguintes condições:
${params.paymentTerms}

CLÁUSULA 4 — PRAZO DE VALIDADE
4.1. Esta proposta permanecerá válida até ${params.validUntil}.
4.2. Expirado o prazo sem aceite, a proposta poderá ser considerada sem efeito.

CLÁUSULA 5 — ACEITE
5.1. O aceite do vendedor poderá ocorrer por meio digital dentro da plataforma IMOBAI.
5.2. Uma vez aceita, a proposta poderá dar origem à promessa de compra e venda ou instrumento equivalente.

CLÁUSULA 6 — REGISTROS DIGITAIS
6.1. A plataforma IMOBAI poderá registrar hash, metadados, eventos e demais evidências digitais vinculadas a esta proposta.

Data da emissão: ${params.createdAt}
ID da proposta: ${params.proposalIdPlaceholder}
ID da negociação: ${params.dealId}
Hash do documento: ${params.proposalHash}
`.trim();
}

export async function POST(req: Request) {
  const client = await pool.connect();

  try {
    const body = (await req.json()) as Partial<Body>;

    const dealId = Number(body.dealId);
    const offerPrice = Number(body.offerPrice);
    const paymentTerms =
      String(body.paymentTerms ?? "").trim() || "Condições não informadas";
    const validUntil =
      String(body.validUntil ?? "").trim() ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    if (![dealId, offerPrice].every(Number.isFinite)) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // 1) Busca o deal
    const dealRes = await client.query<{
      id: number;
      property_id: number;
      buyer_user_id: number;
      seller_user_id: number;
      price: number | string;
      status: string;
    }>(
      `
      SELECT
        id,
        property_id,
        buyer_user_id,
        seller_user_id,
        price,
        status
      FROM deal
      WHERE id = $1
      LIMIT 1
      `,
      [dealId]
    );

    const deal = dealRes.rows[0];

    if (!deal) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Negociação não encontrada" },
        { status: 404 }
      );
    }

    // 2) Busca o imóvel
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
      [deal.property_id]
    );

    const property = propertyRes.rows[0];

    if (!property) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }

    // 3) Cria a proposta
    const proposalRes = await client.query<{ id: number }>(
      `
      INSERT INTO proposals (
        deal_id,
        property_id,
        buyer_user_id,
        seller_user_id,
        offer_price,
        payment_terms,
        valid_until,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'OPEN')
      RETURNING id
      `,
      [
        deal.id,
        deal.property_id,
        deal.buyer_user_id,
        deal.seller_user_id,
        offerPrice,
        paymentTerms,
        validUntil,
      ]
    );

    const proposalId = proposalRes.rows[0].id;
    const createdAt = new Date().toISOString();

    // 4) Monta conteúdo + hash
    const buyerName = `Comprador #${deal.buyer_user_id}`;
    const sellerName = `Vendedor #${deal.seller_user_id}`;

    const draftContent = buildPropostaCompraContent({
      proposalIdPlaceholder: "PENDENTE",
      dealId: deal.id,
      propertyId: deal.property_id,
      propertyTitle: property.title ?? `Imóvel #${deal.property_id}`,
      propertyAddress: property.address ?? "Endereço não informado",
      buyerName,
      sellerName,
      offerPrice,
      paymentTerms,
      validUntil,
      proposalHash: "PENDENTE",
      createdAt,
    });

    const proposalHash = crypto
      .createHash("sha256")
      .update(draftContent)
      .digest("hex");

    const finalContent = buildPropostaCompraContent({
      proposalIdPlaceholder: String(proposalId),
      dealId: deal.id,
      propertyId: deal.property_id,
      propertyTitle: property.title ?? `Imóvel #${deal.property_id}`,
      propertyAddress: property.address ?? "Endereço não informado",
      buyerName,
      sellerName,
      offerPrice,
      paymentTerms,
      validUntil,
      proposalHash,
      createdAt,
    });

    // 5) Cria contrato da proposta
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
        'PROPOSTA_COMPRA',
        1,
        'Proposta de Compra IMOBAI',
        $3,
        $4,
        'GENERATED'
      )
      RETURNING id
      `,
      [deal.id, deal.property_id, finalContent, proposalHash]
    );

    const contractId = contractRes.rows[0].id;

    // 6) Partes do contrato
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

    // 7) Evento do contrato
    await client.query(
      `
      INSERT INTO contract_event (contract_id, event_type, payload)
      VALUES ($1, 'CREATED', $2)
      `,
      [
        contractId,
        `Proposta de compra gerada automaticamente para o deal ${deal.id}.`,
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json(
      {
        ok: true,
        proposalId,
        contractId,
        dealId: deal.id,
      },
      { status: 200 }
    );
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("POST /api/proposals/create error:", e?.message || e);

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

