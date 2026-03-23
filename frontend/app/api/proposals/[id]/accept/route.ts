

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await params;
    const proposalId = Number(id);

    if (!Number.isFinite(proposalId)) {
      return NextResponse.json(
        { error: "proposalId inválido" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const proposalRes = await client.query<{
      id: number;
      deal_id: number;
      price: number;
      conditions: string | null;
      status: string;
    }>(
      `
      UPDATE proposals
      SET status = 'ACCEPTED'
      WHERE id = $1
      RETURNING id, deal_id, price, conditions, status
      `,
      [proposalId]
    );

    const proposal = proposalRes.rows[0];

    if (!proposal) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Proposta não encontrada" },
        { status: 404 }
      );
    }

    const dealRes = await client.query<{
      id: number;
      property_id: number;
      title: string;
      address: string;
    }>(
      `
      SELECT
        d.id,
        d.property_id,
        p.title,
        p.address
      FROM deal d
      JOIN property p ON p.id = d.property_id
      WHERE d.id = $1
      LIMIT 1
      `,
      [proposal.deal_id]
    );

    const deal = dealRes.rows[0];

    if (!deal) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Negociação vinculada não encontrada" },
        { status: 404 }
      );
    }

    const contractRes = await client.query<{ id: number }>(
      `
      UPDATE contract
      SET status = 'SIGNED',
          updated_at = NOW(),
          signed_at = NOW()
      WHERE deal_id = $1
        AND type = 'PROPOSTA_COMPRA'
      RETURNING id
      `,
      [proposal.deal_id]
    );

    const proposalContract = contractRes.rows[0];

    if (proposalContract) {
      await client.query(
        `
        INSERT INTO contract_event (contract_id, event_type, payload)
        VALUES ($1, 'SIGNED', $2)
        `,
        [proposalContract.id, `Proposta ${proposal.id} aceita.`]
      );
    }

    const promessaContent = `
PROMESSA DE COMPRA E VENDA IMOBAI

Negociação #${proposal.deal_id}

Imóvel: ${deal.title}
Endereço: ${deal.address}

Valor acordado: R$ ${Number(proposal.price).toLocaleString("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}
Condições: ${proposal.conditions || "Não informadas"}

As partes concordam em formalizar a compra e venda do imóvel acima descrito,
nos termos da proposta aceita digitalmente na plataforma IMOBAI.

Este documento tem validade jurídica digital e servirá de base para o contrato definitivo.
`.trim();

    const promessaRes = await client.query<{ id: number }>(
      `
      INSERT INTO contract (
        deal_id,
        property_id,
        type,
        version,
        title,
        content,
        status
      )
      VALUES ($1, $2, 'PROMESSA_COMPRA_VENDA', 1, $3, $4, 'GENERATED')
      RETURNING id
      `,
      [
        proposal.deal_id,
        deal.property_id,
        "Promessa de Compra e Venda IMOBAI",
        promessaContent,
      ]
    );

    const promessa = promessaRes.rows[0];

    if (promessa) {
      await client.query(
        `
        INSERT INTO contract_event (contract_id, event_type, payload)
        VALUES ($1, 'GENERATED', $2)
        `,
        [promessa.id, `Promessa gerada automaticamente após aceite da proposta ${proposal.id}.`]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(
      {
        ok: true,
        proposalId: proposal.id,
        status: proposal.status,
        promessaCreated: !!promessa,
      },
      { status: 200 }
    );
  } catch (e: any) {
    await client.query("ROLLBACK");
    console.error("POST /api/proposals/[id]/accept error:", e?.message || e);

    return NextResponse.json(
      { error: "Erro interno", detail: e?.message || String(e) },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}


