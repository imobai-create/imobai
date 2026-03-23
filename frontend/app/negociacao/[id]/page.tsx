

import type { CSSProperties } from "react";
import Link from "next/link";
import pool from "@/lib/db";
import NegotiationChat from "@/app/components/NegotiationChat";
import OfferBox from "@/app/components/OfferBox";
import IssueTrustTokenButton from "@/app/components/IssueTrustTokenButton";
import TrustTokenCard from "@/app/components/TrustTokenCard";
import ProposalActions from "@/app/components/ProposalActions";
import NegotiationTimeline from "@/app/components/NegotiationTimeline";

void IssueTrustTokenButton;
void TrustTokenCard;

type PageProps = {
  params: Promise<{ id: string }>;
};

type DealRow = {
  id: number;
  property_id: number;
  price: number;
  status: string;
  created_at: string;
};

type PropertyRow = {
  id: number;
  title: string;
  address: string | null;
  image: string | null;
  description: string | null;
  price: number | null;
  status_diligencia: string | null;
  score: number | null;
  risk_level: string | null;
};

type ProposalRow = {
  id: number;
  deal_id: number;
  user_id: number;
  price: number;
  conditions: string | null;
  status: string;
  created_at: string;
};

function formatPrice(value: number | null | undefined) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default async function NegociacaoPage({ params }: PageProps) {
  const { id } = await params;
  const dealId = Number(id);

  if (!Number.isFinite(dealId)) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={h1}>Negociação inválida</h1>
            <p style={muted}>
              O identificador da negociação não foi reconhecido.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const dealRes = await pool.query<DealRow>(
    `
    SELECT
      id,
      property_id,
      price,
      status,
      created_at
    FROM deal
    WHERE id = $1
    LIMIT 1
    `,
    [dealId]
  );

  const deal = dealRes.rows[0];

  if (!deal) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={h1}>Negociação não encontrada</h1>
            <p style={muted}>
              Essa negociação ainda não existe ou foi removida.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const propertyRes = await pool.query<PropertyRow>(
    `
    SELECT
      id,
      title,
      address,
      image,
      description,
      price,
      status_diligencia,
      score,
      risk_level
    FROM property
    WHERE id = $1
    LIMIT 1
    `,
    [deal.property_id]
  );

  const imovel = propertyRes.rows[0] ?? null;

  const latestProposalRes = await pool.query<ProposalRow>(
    `
    SELECT
      id,
      deal_id,
      user_id,
      price,
      conditions,
      status,
      created_at
    FROM proposals
    WHERE deal_id = $1
    ORDER BY created_at DESC, id DESC
    LIMIT 1
    `,
    [dealId]
  );

  const latestProposal = latestProposalRes.rows[0] ?? null;

  const intermediationRes = await pool.query<{ id: number; status: string }>(
    `
    SELECT id, status
    FROM contract
    WHERE deal_id = $1
      AND type = 'INTERMEDIACAO_DIGITAL'
    ORDER BY id DESC
    LIMIT 1
    `,
    [dealId]
  );

  const propostaContractRes = await pool.query<{ id: number; status: string }>(
    `
    SELECT id, status
    FROM contract
    WHERE deal_id = $1
      AND type = 'PROPOSTA_COMPRA'
    ORDER BY id DESC
    LIMIT 1
    `,
    [dealId]
  );

  const promessaRes = await pool.query<{ id: number; status: string }>(
    `
    SELECT id, status
    FROM contract
    WHERE deal_id = $1
      AND type = 'PROMESSA_COMPRA_VENDA'
    ORDER BY id DESC
    LIMIT 1
    `,
    [dealId]
  );

  const intermediation = intermediationRes.rows[0] ?? null;
  const propostaContract = propostaContractRes.rows[0] ?? null;
  const promessa = promessaRes.rows[0] ?? null;

  const proposalAccepted = latestProposal?.status === "ACCEPTED";
  const promessaSigned =
    promessa?.status === "SIGNED" || promessa?.status === "PARTIALLY_SIGNED";

  const timelineSteps = [
    {
      label: "Interesse iniciado",
      done: true,
      current: !intermediation,
    },
    {
      label: "Contrato de intermediação",
      done: !!intermediation,
      current: !!intermediation && !latestProposal,
    },
    {
      label: "Proposta enviada",
      done: !!latestProposal,
      current: !!latestProposal && latestProposal.status === "PENDING",
    },
    {
      label: "Proposta aceita",
      done: proposalAccepted,
      current: proposalAccepted && !promessa,
    },
    {
      label: "Promessa gerada",
      done: !!promessa,
      current: !!promessa && !promessaSigned,
    },
    {
      label: "Promessa assinada",
      done: promessa?.status === "SIGNED",
      current: promessa?.status === "PARTIALLY_SIGNED",
    },
    {
      label: "Pagamento protegido",
      done: false,
      current: false,
    },
    {
      label: "Fechamento",
      done: false,
      current: false,
    },
  ];

  return (
    <main style={pageBg}>
      <div style={shell}>
        <Link href={`/imovel/${deal.property_id}`} style={backLink}>
          ← Voltar
        </Link>

        <section style={heroCard}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={pill}>Negociação protegida na plataforma</div>

            <h1 style={h1}>Negociação</h1>

            <h2 style={titleStyle}>
              {imovel?.title ?? `Imóvel #${deal.property_id}`}
            </h2>

            <p style={addressStyle}>
              {imovel?.address ?? "Endereço não informado"}
            </p>

            <div style={priceStyle}>{formatPrice(deal.price)}</div>

            <p style={muted}>
              Os contatos seguem protegidos até a assinatura do contrato de
              indicação.
            </p>
          </div>

          <div style={actionsCol}>
            {intermediation && (
              <Link
                href={`/negociacao/${deal.id}/contrato/intermediacao`}
                style={btnPrimary}
              >
                Ver contrato de intermediação
              </Link>
            )}

            {propostaContract && (
              <Link
                href={`/negociacao/${deal.id}/contrato/proposta`}
                style={btnSecondary}
              >
                Ver proposta
              </Link>
            )}

            {promessa && (
              <Link
                href={`/negociacao/${deal.id}/contrato/promessa`}
                style={btnSecondary}
              >
                Ver promessa
              </Link>
            )}
          </div>
        </section>

        <NegotiationTimeline steps={timelineSteps} />

        {latestProposal && (
          <section style={proposalCard}>
            <div style={sectionTitle}>Proposta atual</div>

            <div style={proposalLine}>
              <strong>Valor:</strong> {formatPrice(latestProposal.price)}
            </div>

            <div style={proposalLine}>
              <strong>Condições:</strong>{" "}
              {latestProposal.conditions || "Não informadas"}
            </div>

            <div style={proposalLine}>
              <strong>Status:</strong> {latestProposal.status}
            </div>

            <div style={proposalLine}>
              <strong>Criada em:</strong>{" "}
              {new Date(latestProposal.created_at).toLocaleString("pt-BR")}
            </div>

            <ProposalActions proposal={latestProposal} />
          </section>
        )}

        <section style={paymentCard}>
          <div style={sectionTitle}>Pagamento protegido</div>
          <p style={muted}>
            Em breve, comprador e vendedor poderão pagar e receber diretamente
            pela IMOBAI com proteção da transação. O valor ficará seguro na
            plataforma até a etapa correta da negociação.
          </p>

          <div style={paymentBox}>
            <div>✔ Seu dinheiro fica protegido</div>
            <div>✔ Ninguém recebe antes da hora</div>
            <div>✔ Tudo fica registrado na plataforma</div>
          </div>
        </section>

        <section style={chatCard}>
          <h2 style={sectionTitle}>Chat da negociação</h2>
          <NegotiationChat dealId={deal.id} buyerId={1} sellerId={1} />
        </section>

        <section style={offerCard}>
          <OfferBox dealId={deal.id} buyerId={1} sellerId={1} />
        </section>
      </div>
    </main>
  );
}

const pageBg: CSSProperties = {
  minHeight: "100vh",
  background: "#eef2f5",
  padding: "32px 20px 60px",
};

const shell: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
};

const backLink: CSSProperties = {
  display: "inline-flex",
  textDecoration: "none",
  color: "#111827",
  fontWeight: 700,
  marginBottom: 18,
};

const heroCard: CSSProperties = {
  display: "flex",
  gap: 24,
  justifyContent: "space-between",
  alignItems: "flex-start",
  flexWrap: "wrap",
  padding: 28,
  borderRadius: 24,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(15,23,42,0.08)",
};

const card: CSSProperties = {
  padding: 28,
  borderRadius: 24,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(15,23,42,0.08)",
};

const pill: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "#fff",
  color: "#111827",
  fontWeight: 700,
  fontSize: 14,
};

const h1: CSSProperties = {
  margin: "18px 0 10px",
  fontSize: 68,
  lineHeight: 1,
  fontWeight: 900,
  color: "#0f172a",
};

const titleStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 30,
  lineHeight: 1.1,
  fontWeight: 800,
  color: "#0f172a",
};

const addressStyle: CSSProperties = {
  margin: 0,
  color: "#475569",
  fontSize: 20,
};

const priceStyle: CSSProperties = {
  marginTop: 22,
  fontSize: 74,
  lineHeight: 1,
  fontWeight: 900,
  color: "#0f172a",
};

const muted: CSSProperties = {
  marginTop: 18,
  color: "#64748b",
  fontSize: 15,
  lineHeight: 1.6,
};

const actionsCol: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  minWidth: 280,
};

const btnPrimary: CSSProperties = {
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 52,
  padding: "0 18px",
  borderRadius: 16,
  background: "#111827",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
};

const btnSecondary: CSSProperties = {
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 52,
  padding: "0 18px",
  borderRadius: 16,
  background: "#fff",
  color: "#111827",
  border: "1px solid rgba(15,23,42,0.10)",
  textDecoration: "none",
  fontWeight: 700,
};

const sectionTitle: CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 800,
  color: "#0f172a",
};

const proposalCard: CSSProperties = {
  marginTop: 22,
  padding: 24,
  borderRadius: 20,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(15,23,42,0.08)",
};

const proposalLine: CSSProperties = {
  marginTop: 12,
  color: "#111827",
  fontSize: 15,
  lineHeight: 1.6,
};

const paymentCard: CSSProperties = {
  marginTop: 22,
  padding: 24,
  borderRadius: 20,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(15,23,42,0.08)",
};

const paymentBox: CSSProperties = {
  marginTop: 16,
  display: "grid",
  gap: 10,
  padding: 16,
  borderRadius: 14,
  background: "rgba(15,23,42,0.04)",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#0f172a",
  fontWeight: 600,
};

const chatCard: CSSProperties = {
  marginTop: 22,
  padding: 24,
  borderRadius: 20,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(15,23,42,0.08)",
};

const offerCard: CSSProperties = {
  marginTop: 22,
  padding: 24,
  borderRadius: 20,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(15,23,42,0.08)",
};













