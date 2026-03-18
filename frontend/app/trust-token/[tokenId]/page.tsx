








import Link from "next/link";
import pool from "@/lib/db";

type PageProps = {
  params: Promise<{ tokenId: string }>;
};

type TokenRow = {
  id: number;
  deal_id: number | null;
  property_id: number | null;
  buyer_user_id: number | null;
  seller_user_id: number | null;
  trust_score: number | null;
  risk_level: string | null;
  score_version: string | null;
  contract_hash: string | null;
  diligence_hash: string | null;
  blockchain_receipt_id: number | null;
  network: string | null;
  token_reference: string;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  title: string | null;
  address: string | null;
  description: string | null;
  price: number | string | null;
  status_diligencia: string | null;
};

function formatPrice(value: number | string | null) {
  const num =
    typeof value === "number" ? value : value ? Number(value) : NaN;

  if (!Number.isFinite(num)) return "Preço não informado";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(num);
}

export default async function TrustTokenPublicPage({ params }: PageProps) {
  const { tokenId } = await params;

  const tokenRes = await pool.query<TokenRow>(
    `
      SELECT
        t.id,
        t.deal_id,
        t.property_id,
        t.buyer_user_id,
        t.seller_user_id,
        t.trust_score,
        t.risk_level,
        t.score_version,
        t.contract_hash,
        t.diligence_hash,
        t.blockchain_receipt_id,
        t.network,
        t.token_reference,
        t.status,
        t.created_at,
        t.updated_at,

        p.title,
        p.address,
        p.description,
        p.price,
        p.status_diligencia

      FROM trust_token t
      LEFT JOIN property p
        ON p.id = t.property_id
      WHERE t.token_reference = $1
      LIMIT 1
    `,
    [tokenId]
  );

  const token = tokenRes.rows[0];

  if (!token) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <section style={card}>
            <div style={pill}>TRUST TOKEN PÚBLICO</div>
            <h1 style={h1}>Certificado não encontrado</h1>
            <p style={muted}>
              O token informado não existe ou ainda não foi publicado.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main style={pageBg}>
      <div style={shell}>
        <Link href="/marketplace" style={backLink}>
          ← Voltar
        </Link>

        <section style={heroCard}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={pill}>TRUST TOKEN PÚBLICO</div>
            <h1 style={heroTitle}>{token.title ?? "Imóvel certificado"}</h1>
            <p style={heroAddress}>{token.address ?? "Endereço não informado"}</p>
          </div>

          <div style={scoreCard}>
            <div style={scoreLabel}>TRUST SCORE</div>
            <div style={scoreValue}>{token.trust_score ?? "--"}</div>
            <div style={scoreRisk}>
              {token.risk_level
                ? `Risco ${String(token.risk_level).toLowerCase()}`
                : "Risco não informado"}
            </div>
          </div>
        </section>

        <section style={grid}>
          <div style={card}>
            <div style={sectionTitle}>Resumo do ativo</div>

            <div style={fieldLabel}>Imóvel</div>
            <div style={fieldValue}>{token.title ?? "Não informado"}</div>

            <div style={fieldLabel}>Endereço</div>
            <div style={fieldValue}>{token.address ?? "Não informado"}</div>

            <div style={fieldLabel}>Preço de referência</div>
            <div style={priceValue}>{formatPrice(token.price)}</div>

            <div style={fieldLabel}>Diligência</div>
            <div style={fieldValue}>
              {token.status_diligencia ?? "Não informada"}
            </div>

            <div style={fieldLabel}>Descrição</div>
            <div style={fieldValue}>
              {token.description ?? "Sem descrição"}
            </div>
          </div>

          <div style={card}>
            <div style={sectionTitle}>Rastreabilidade</div>

            <div style={fieldLabel}>Token</div>
            <div style={fieldMono}>{token.token_reference}</div>

            <div style={fieldLabel}>Status</div>
            <div style={fieldValue}>{token.status ?? "Não informado"}</div>

            <div style={fieldLabel}>Deal ID</div>
            <div style={fieldValue}>
              {token.deal_id !== null ? `#${token.deal_id}` : "Não informado"}
            </div>

            <div style={fieldLabel}>Property ID</div>
            <div style={fieldValue}>
              {token.property_id !== null ? `#${token.property_id}` : "Não informado"}
            </div>

            <div style={fieldLabel}>Network</div>
            <div style={fieldValue}>{token.network ?? "Não informada"}</div>

            <div style={fieldLabel}>Versão do score</div>
            <div style={fieldValue}>{token.score_version ?? "Não informada"}</div>

            <div style={fieldLabel}>Hash do contrato</div>
            <div style={fieldHash}>
              {token.contract_hash ?? "Ainda não disponível"}
            </div>

            <div style={fieldLabel}>Hash da diligência</div>
            <div style={fieldHash}>
              {token.diligence_hash ?? "Ainda não disponível"}
            </div>

            <div style={fieldLabel}>Emitido em</div>
            <div style={fieldValue}>
              {token.created_at
                ? new Date(token.created_at).toLocaleString("pt-BR")
                : "Não informado"}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background: "#eef1f4",
  padding: "28px 20px 60px",
};

const shell: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
};

const backLink: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  textDecoration: "none",
  color: "#334155",
  fontWeight: 600,
  marginBottom: 18,
};

const heroCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 28,
  padding: 28,
  display: "flex",
  gap: 24,
  justifyContent: "space-between",
  flexWrap: "wrap",
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.10)",
  color: "#475569",
  fontSize: 13,
  fontWeight: 700,
};

const heroTitle: React.CSSProperties = {
  margin: "18px 0 8px",
  fontSize: 64,
  lineHeight: 0.95,
  fontWeight: 800,
  letterSpacing: "-0.05em",
  color: "#0f172a",
};

const heroAddress: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  color: "#475569",
};

const scoreCard: React.CSSProperties = {
  minWidth: 280,
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 24,
  padding: 24,
  alignSelf: "flex-start",
};

const scoreLabel: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#7f1d1d",
};

const scoreValue: React.CSSProperties = {
  marginTop: 8,
  fontSize: 72,
  lineHeight: 1,
  fontWeight: 800,
  color: "#991b1b",
};

const scoreRisk: React.CSSProperties = {
  marginTop: 6,
  fontSize: 20,
  fontWeight: 700,
  color: "#7f1d1d",
};

const grid: React.CSSProperties = {
  marginTop: 22,
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: 20,
};

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 24,
  padding: 24,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  color: "#475569",
  textTransform: "uppercase",
  marginBottom: 18,
};

const fieldLabel: React.CSSProperties = {
  marginTop: 14,
  fontSize: 14,
  color: "#64748b",
  fontWeight: 700,
};

const fieldValue: React.CSSProperties = {
  marginTop: 4,
  fontSize: 18,
  color: "#0f172a",
  fontWeight: 600,
};

const fieldMono: React.CSSProperties = {
  marginTop: 4,
  fontSize: 18,
  color: "#0f172a",
  fontWeight: 700,
  wordBreak: "break-all",
};

const fieldHash: React.CSSProperties = {
  marginTop: 4,
  fontSize: 15,
  color: "#334155",
  wordBreak: "break-all",
};

const priceValue: React.CSSProperties = {
  marginTop: 4,
  fontSize: 26,
  color: "#0f172a",
  fontWeight: 800,
};

const h1: React.CSSProperties = {
  margin: "14px 0 10px",
  fontSize: 52,
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "-0.05em",
  color: "#0f172a",
};

const muted: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  lineHeight: 1.6,
  color: "#64748b",
};













