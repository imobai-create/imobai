

import Link from "next/link";
import pool from "@/lib/db";
import NegotiationChat from "@/app/components/NegotiationChat";
import OfferBox from "@/app/components/OfferBox";
import IssueTrustTokenButton from '../../components/IssueTrustTokenButton';
import TrustTokenCard from '../../components/TrustTokenCard'
import ProposalActions from "@/app/components/ProposalActions";


type PageProps = {
  params: Promise<{ id: string }>;
};

type ProposalRow = {
  id: number;
  deal_id: number;
  user_id: number;
  price: number | string;
  conditions: string | null;
  status: string;
  created_at: string;
};

type DealRow = {
  id: number;
  propertyId: number;
  buyerId: number;
  sellerId: number;
  price: number | string;
};

 type TrustToken = {
  id: number;
  deal_id: number;
  property_id: number;
  buyer_user_id: number;
  seller_user_id: number;
  trust_score: number;
  risk_level: string;
  score_version: string;
  contract_hash: string | null;
  diligence_hash: string | null;
  blockchain_receipt_id: number | null;
  network: string;
  token_reference: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type PropertyRow = {
  id: number;
  title: string;
  address: string;
  image?: string | null;
};

function formatPrice(value: number | string) {
  const num = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(num)) return "Preço sob consulta";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(num);
}

export default async function NegociacaoPage({ params }: PageProps) {
  const { id } = await params;
  const dealId = Number(id);

  if (!Number.isFinite(dealId)) {
    return (
      <main style={pageBg}>
        <div style={shell}>

<TrustTokenCard dealId={Number(id)} />
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

    let trustToken: TrustToken | null = null;

  try {
    // const res = await fetch(...)
    const trustTokenRes = await fetch(
      `/api/trust-token/${dealId}`,
      { cache: 'no-store' }
    );

    if (trustTokenRes.ok) {
      trustToken = await trustTokenRes.json();
    }
  } catch (error) {
    console.error('Erro ao buscar trust token:', error);
  }

const dealRes = await pool.query<DealRow>(`
  SELECT
    id,
    property_id AS "propertyId",
    buyer_user_id AS "buyerId",
    seller_user_id AS "sellerId",
    price
  FROM deal
  WHERE id = $1
  LIMIT 1
`, [dealId]);

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
      image
    FROM property
    WHERE id = $1
    LIMIT 1
    `,
    [deal.propertyId]
  );

  const imovel = propertyRes.rows[0];


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

  return (
    <main style={pageBg}>
      <div style={shell}>
        <Link href={`/imovel/${deal.propertyId}`} style={backLink}>
          ← Voltar
        </Link>

        <section style={heroCard}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={pill}>Negociação protegida na plataforma</div>

            <h1 style={h1}>Negociação</h1>

            <h2 style={title}>
              {imovel?.title ?? `Imóvel #${deal.propertyId}`}
            </h2>

            <p style={address}>
              {imovel?.address ?? "Endereço não informado"}
            </p>

            <div style={price}>{formatPrice(deal.price)}</div>

            <p style={muted}>
              Os contatos seguem protegidos até a assinatura do contrato de
              indicação.
            </p>
          </div>

         
<div style={actionsCol}>
  <Link
    href={`/negociacao/${deal.id}/contrato/intermediacao`}
    style={btnPrimary}
  >
    Ver contrato de intermediação
  </Link>

  <Link
    href={`/negociacao/${deal.id}/contrato/proposta`}
    style={btnSecondary}
  >
    Ver proposta
  </Link>

  <Link href="/#planos" style={btnSecondary}>
    Planos
  </Link>
</div>

<ProposalActions proposal={latestProposal} />

{latestProposal?.status === "ACCEPTED" && (
  <Link
    href={`/negociacao/${deal.id}/contrato/promessa`}
    style={{
      marginTop: 12,
      display: "inline-block",
      padding: "10px 16px",
      background: "#111",
      color: "#fff",
      borderRadius: 8,
      textDecoration: "none",
      fontWeight: 600,
    }}
  >
    Ver promessa de compra e venda
  </Link>
)}

        </section>

       <section style={chatCard}>
  <h2 style={sectionTitle}>Chat da negociação</h2>

  <NegotiationChat  
  dealId={deal.id}
    buyerId={deal.buyerId}
    sellerId={deal.sellerId}
  />

  <OfferBox
    dealId={deal.id}
    buyerId={deal.buyerId}
    sellerId={deal.sellerId}
  />

</section>
      </div>
    </main>
  );
}

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background: "#eef2f7",
  padding: "28px 20px 60px",
};

const shell: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
};

const backLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  color: "#475569",
  textDecoration: "none",
  fontWeight: 600,
  marginBottom: 18,
};

const card: React.CSSProperties = {
  background: "#fff",
  borderRadius: 28,
  padding: 28,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 20px 45px rgba(15,23,42,0.06)",
};

const heroCard: React.CSSProperties = {
  ...card,
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  flexWrap: "wrap",
};

const chatCard: React.CSSProperties = {
  ...card,
  marginTop: 22,
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "9px 14px",
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#475569",
  fontSize: 14,
  fontWeight: 700,
};

const h1: React.CSSProperties = {
  margin: "20px 0 0",
  fontSize: 62,
  lineHeight: 0.95,
  letterSpacing: "-0.05em",
  fontWeight: 820,
  color: "#0f172a",
};

const title: React.CSSProperties = {
  margin: "24px 0 0",
  fontSize: 28,
  lineHeight: 1.05,
  letterSpacing: "-0.04em",
  fontWeight: 780,
  color: "#0f172a",
};

const address: React.CSSProperties = {
  marginTop: 12,
  color: "#64748b",
  fontSize: 18,
};

const price: React.CSSProperties = {
  marginTop: 22,
  fontSize: 56,
  lineHeight: 0.95,
  letterSpacing: "-0.05em",
  fontWeight: 840,
  color: "#020617",
};

const muted: React.CSSProperties = {
  marginTop: 16,
  color: "#64748b",
  fontSize: 18,
  lineHeight: 1.55,
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 780,
  letterSpacing: "-0.03em",
  color: "#0f172a",
};

const actionsCol: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "flex-start",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "#0f172a",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 16,
  border: "1px solid rgba(15,23,42,0.08)",
};

const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "#fff",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 16,
  border: "1px solid rgba(15,23,42,0.12)",
};




