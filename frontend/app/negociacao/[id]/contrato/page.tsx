
import Link from "next/link";
import pool from "@/lib/db";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ContractRow = {
  id: number;
  deal_id: number;
  property_id: number;
  type: string;
  version: number;
  title: string;
  content: string;
  hash: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  signed_at: string | null;
};

export default async function ContratoPage({ params }: PageProps) {
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
            <h1 style={title}>Negociação inválida</h1>
            <p style={muted}>O identificador informado não é válido.</p>
          </div>
        </div>
      </main>
    );
  }

  const contractRes = await pool.query<ContractRow>(
    `
    SELECT
      id,
      deal_id,
      property_id,
      type,
      version,
      title,
      content,
      hash,
      status,
      created_at,
      updated_at,
      signed_at
    FROM contract
    WHERE deal_id = $1
    ORDER BY id DESC
    LIMIT 1
    `,
    [dealId]
  );

  const contract = contractRes.rows[0];

  if (!contract) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href={`/negociacao/${dealId}`} style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={title}>Contrato não encontrado</h1>
            <p style={muted}>
              Ainda não existe contrato salvo para esta negociação.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageBg}>
      <div style={shell}>
        <Link href={`/negociacao/${dealId}`} style={backLink}>
          ← Voltar
        </Link>

        <div style={heroCard}>
          <div>
            <div style={pill}>CONTRATO DA NEGOCIAÇÃO</div>
            <h1 style={heroTitle}>{contract.title}</h1>
            <p style={muted}>
              Documento oficial vinculado à negociação #{contract.deal_id}.
            </p>
          </div>

          <div style={metaGrid}>
            <div style={metaBox}>
              <div style={metaLabel}>Tipo</div>
              <div style={metaValue}>{contract.type}</div>
            </div>

            <div style={metaBox}>
              <div style={metaLabel}>Status</div>
              <div style={metaValue}>{contract.status}</div>
            </div>

            <div style={metaBox}>
              <div style={metaLabel}>Versão</div>
              <div style={metaValue}>v{contract.version}</div>
            </div>

            <div style={metaBox}>
              <div style={metaLabel}>Criado em</div>
              <div style={metaValue}>
                {new Date(contract.created_at).toLocaleString("pt-BR")}
              </div>
            </div>
          </div>
        </div>

        <div style={contentCard}>
          <h2 style={sectionTitle}>Conteúdo do contrato</h2>

          <pre style={contractText}>{contract.content}</pre>

          <div style={hashBox}>
            <div style={metaLabel}>Hash</div>
            <div style={hashValue}>{contract.hash ?? "Ainda não gerado"}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background: "#eef1f4",
  color: "#111827",
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
  fontSize: 48,
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

const metaGrid: React.CSSProperties = {
  marginTop: 22,
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 14,
};

const metaBox: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 18,
  padding: 16,
};

const metaLabel: React.CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  fontWeight: 700,
  textTransform: "uppercase",
};

const metaValue: React.CSSProperties = {
  marginTop: 6,
  fontSize: 18,
  color: "#0f172a",
  fontWeight: 700,
};

const contentCard: React.CSSProperties = {
  marginTop: 22,
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 28,
  padding: 28,
};

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 24,
  fontWeight: 800,
  color: "#0f172a",
};

const contractText: React.CSSProperties = {
  marginTop: 18,
  whiteSpace: "pre-wrap",
  fontFamily: "inherit",
  fontSize: 17,
  lineHeight: 1.7,
  color: "#334155",
};

const hashBox: React.CSSProperties = {
  marginTop: 24,
  paddingTop: 18,
  borderTop: "1px solid rgba(15,23,42,0.08)",
};

const hashValue: React.CSSProperties = {
  marginTop: 8,
  fontSize: 14,
  color: "#334155",
  wordBreak: "break-all",
};

const card: React.CSSProperties = {
  marginTop: 24,
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 24,
  padding: 24,
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 32,
  fontWeight: 760,
};