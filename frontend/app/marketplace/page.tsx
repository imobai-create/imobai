import Link from "next/link";
import pool from "@/lib/db";

type MarketplaceRow = {
  id: number;
  title: string;
  description: string | null;
  price: number | string | null;
  address: string | null;
  image: string | null;
  status_diligencia: string | null;
  trust_score: number | null;
  risk_level: string | null;
  token_reference: string | null;
};

function formatPrice(value: number | string | null) {
  const num =
    typeof value === "number" ? value : value ? Number(value) : Number.NaN;

  if (!Number.isFinite(num)) return "Preço sob consulta";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(num);
}

function riskText(risk: string | null) {
  if (!risk) return "Sem score";
  const value = risk.toUpperCase();
  if (value === "HIGH") return "Risco HIGH";
  if (value === "MEDIUM") return "Risco MEDIUM";
  if (value === "LOW") return "Risco LOW";
  return `Risco ${value}`;
}

export default async function MarketplacePage() {
  let imoveis: MarketplaceRow[] = [];
  let dbError: string | null = null;

  try {
    const res = await pool.query<MarketplaceRow>(`
      SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.address,
        p.image,
        p.status_diligencia,
        tt.trust_score,
        tt.risk_level,
        tt.token_reference
      FROM property p
      LEFT JOIN LATERAL (
        SELECT
          t.trust_score,
          t.risk_level,
          t.token_reference
        FROM trust_token t
        WHERE t.property_id = p.id
        ORDER BY t.id DESC
        LIMIT 1
      ) tt ON true
      ORDER BY p.id DESC
    `);

    imoveis = res.rows;
  } catch (error) {
    console.error("Marketplace query error:", error);

    dbError =
      error instanceof Error ? error.message : "Erro ao carregar marketplace.";

    try {
      const fallback = await pool.query<
        Omit<
          MarketplaceRow,
          "trust_score" | "risk_level" | "token_reference"
        > & {
          trust_score: null;
          risk_level: null;
          token_reference: null;
        }
      >(`
        SELECT
          p.id,
          p.title,
          p.description,
          p.price,
          p.address,
          p.image,
          p.status_diligencia,
          NULL::integer AS trust_score,
          NULL::text AS risk_level,
          NULL::text AS token_reference
        FROM property p
        ORDER BY p.id DESC
      `);

      imoveis = fallback.rows;
    } catch (fallbackError) {
      console.error("Marketplace fallback query error:", fallbackError);
      imoveis = [];
    }
  }

  return (
    <main style={pageBg}>
      <section style={shell}>
        <div style={{ maxWidth: 980 }}>
          <div style={brand}>ImobAI</div>
          <div style={brandSub}>IMOBAI — você no comando.</div>

          <h1 style={heroTitle}>Marketplace</h1>
          <p style={heroText}>
            A maneira mais simples e segura de comprar ou vender imóveis. Sem
            burocracia e com proteção jurídica automática.
          </p>
        </div>

        {dbError ? (
          <div style={warningBox}>
            <strong>Atenção:</strong> o marketplace carregou em modo de
            recuperação. Detalhe técnico: {dbError}
          </div>
        ) : null}

        <div style={grid}>
          {imoveis.map((item) => {
            const imageSrc = item.image?.trim() ? item.image : null;
            const hasToken = !!item.token_reference;

            return (
              <article key={item.id} style={card}>
                <div style={mediaWrap}>
                  {imageSrc ? (
                    <img src={imageSrc} alt={item.title} style={media} />
                  ) : (
                    <div style={mediaFallback}>Imagem não disponível</div>
                  )}
                </div>

                <div style={content}>
                  <div style={topBar}>
                    <div style={trustPill}>
                      <span style={dot} />
                      {item.trust_score !== null
                        ? `Trust Score ${item.trust_score} • ${riskText(item.risk_level)}`
                        : "Trust Score -- • Sem score"}
                    </div>
                  </div>

                  <h2 style={title}>{item.title}</h2>

                  <div style={address}>
                    {item.address ?? "Endereço não informado"}
                  </div>

                  <div style={price}>{formatPrice(item.price)}</div>

                  <div style={statusRow}>
                    <span style={statusChip}>
                      {item.status_diligencia ?? "PENDENTE"}
                    </span>
                  </div>

                  <p style={description}>
                    {item.description ?? "Descrição não informada."}
                  </p>

                  <div style={actionsGrid}>
                    <Link href={`/imovel/${item.id}`} style={btnPrimary}>
                      Falar com o proprietário
                    </Link>

                    <Link href={`/imovel/${item.id}`} style={btnSecondary}>
                      Ver imóvel
                    </Link>

                    <Link href={`/diligencia/${item.id}`} style={btnSecondary}>
                      Ver diligência
                    </Link>

                    {hasToken ? (
                      <Link
                        href={`/trust-token/${item.token_reference}`}
                        style={btnSecondary}
                      >
                        Ver certificado
                      </Link>
                    ) : (
                      <button type="button" style={btnDisabled} disabled>
                        Token não disponível
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!imoveis.length ? (
          <div style={emptyBox}>
            Nenhum imóvel encontrado no marketplace.
          </div>
        ) : null}
      </section>
    </main>
  );
}

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background: "#eef1f4",
  color: "#111827",
};

const shell: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "32px 24px 70px",
};

const brand: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 760,
  letterSpacing: "-0.04em",
};

const brandSub: React.CSSProperties = {
  marginTop: 4,
  fontSize: 15,
  color: "#64748b",
};

const heroTitle: React.CSSProperties = {
  margin: "18px 0 0",
  fontSize: 72,
  lineHeight: 0.98,
  fontWeight: 780,
  letterSpacing: "-0.06em",
};

const heroText: React.CSSProperties = {
  marginTop: 18,
  maxWidth: 980,
  fontSize: 24,
  lineHeight: 1.5,
  color: "#475569",
};

const warningBox: React.CSSProperties = {
  marginTop: 24,
  borderRadius: 18,
  padding: "16px 18px",
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(220,38,38,0.18)",
  color: "#7f1d1d",
};

const emptyBox: React.CSSProperties = {
  marginTop: 24,
  borderRadius: 18,
  padding: "22px 20px",
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#475569",
};

const grid: React.CSSProperties = {
  marginTop: 34,
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 24,
};

const card: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.15fr 0.85fr",
  borderRadius: 30,
  overflow: "hidden",
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
};

const mediaWrap: React.CSSProperties = {
  minHeight: 420,
  background: "#dbe4ee",
};

const media: React.CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: 420,
  objectFit: "cover",
  display: "block",
};

const mediaFallback: React.CSSProperties = {
  minHeight: 420,
  display: "grid",
  placeItems: "center",
  color: "#64748b",
  background:
    "linear-gradient(135deg, rgba(226,232,240,0.9), rgba(241,245,249,0.95))",
};

const content: React.CSSProperties = {
  padding: 28,
  display: "flex",
  flexDirection: "column",
};

const topBar: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const trustPill: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 999,
  border: "1px solid rgba(185,28,28,0.12)",
  background: "rgba(255,255,255,0.84)",
  color: "#9f1239",
  fontWeight: 700,
};

const dot: React.CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: 999,
  background: "#ef4444",
  flexShrink: 0,
};

const title: React.CSSProperties = {
  margin: "18px 0 0",
  fontSize: 54,
  lineHeight: 0.98,
  fontWeight: 780,
  letterSpacing: "-0.05em",
};

const address: React.CSSProperties = {
  marginTop: 14,
  fontSize: 20,
  color: "#475569",
};

const price: React.CSSProperties = {
  marginTop: 18,
  fontSize: 48,
  fontWeight: 780,
  letterSpacing: "-0.04em",
};

const statusRow: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const statusChip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.10)",
  color: "#475569",
  fontWeight: 600,
  background: "rgba(255,255,255,0.82)",
};

const description: React.CSSProperties = {
  marginTop: 18,
  color: "#475569",
  lineHeight: 1.65,
  fontSize: 17,
};

const actionsGrid: React.CSSProperties = {
  marginTop: 24,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 18px",
  borderRadius: 16,
  textDecoration: "none",
  fontWeight: 600,
};

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: "#111827",
  color: "#ffffff",
  border: "1px solid rgba(0,0,0,0.08)",
};

const btnSecondary: React.CSSProperties = {
  ...btnBase,
  background: "#ffffff",
  color: "#111827",
  border: "1px solid rgba(15,23,42,0.10)",
};

const btnDisabled: React.CSSProperties = {
  ...btnBase,
  background: "#f8fafc",
  color: "#94a3b8",
  border: "1px solid rgba(15,23,42,0.08)",
  cursor: "not-allowed",
};
