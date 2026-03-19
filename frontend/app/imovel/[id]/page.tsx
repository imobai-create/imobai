


import Link from "next/link";
import pool from "@/lib/db";
import InterestButton from "@/app/components/InterestButton";
import ViewCertificateButton from "@/app/components/ViewCertificateButton";
import TrustBadge from "@/app/components/TrustBadge";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ImovelRow = {
  id: number;
  title: string;
  description: string | null;
  price: number | string | null;
  address: string | null;
  image: string | null;
  status_diligencia: string | null;
  score: number | null;
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

export default async function ImovelPage({ params }: PageProps) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!Number.isFinite(propertyId)) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={errorCard}>
            <h1 style={errorTitle}>Imóvel inválido</h1>
            <p style={errorText}>O identificador informado não é válido.</p>
          </div>
        </div>
      </main>
    );
  }

  let imovel: ImovelRow | null = null;
  let queryError: string | null = null;

  try {
    const res = await pool.query<ImovelRow>(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.price,
        p.address,
        p.image,
        p.status_diligencia,
        p.user_id AS "userId",
        tt.trust_score AS score,
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
      WHERE p.id = $1
      LIMIT 1
      `,
      [propertyId]
    );

    imovel = res.rows[0] ?? null;
  } catch (error) {
    console.error("Erro ao carregar imóvel:", error);
    queryError =
      error instanceof Error ? error.message : "Erro ao carregar imóvel.";
  }

  if (queryError) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={errorCard}>
            <h1 style={errorTitle}>Erro ao abrir imóvel</h1>
            <p style={errorText}>{queryError}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!imovel) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={errorCard}>
            <h1 style={errorTitle}>Imóvel não encontrado</h1>
            <p style={errorText}>
              Esse imóvel não existe ou foi removido.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const imageSrc = imovel.image?.trim() ? imovel.image : null;

  return (
    <main style={pageBg}>
      <div style={shell}>
        <div style={topRow}>
          <TrustBadge
            score={imovel.score ?? undefined}
            riskLevel={imovel.risk_level ?? undefined}
          />

          <ViewCertificateButton
            tokenReference={imovel.token_reference ?? null}
          />
        </div>

        <Link href="/marketplace" style={backLink}>
          ← Voltar
        </Link>

        <div style={contentGrid}>
          <div>
            <div style={imageCard}>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imovel.title}
                  style={imageStyle}
                />
              ) : (
                <div style={imageFallback}>Imagem não disponível</div>
              )}
            </div>
          </div>

          <aside style={sideCard}>
            <div style={pill}>IMOBAI — você no comando.</div>

            <h1 style={title}>{imovel.title}</h1>

            <div style={chipsRow}>
              <span style={chip}>ID {imovel.id}</span>
              <span style={chip}>
                Diligência: {imovel.status_diligencia ?? "PENDENTE"}
              </span>
              <span style={chip}>
                {imovel.address ?? "Endereço não informado"}
              </span>
            </div>

            <p style={description}>
              {imovel.description ?? "Descrição não informada."}
            </p>

            <div style={price}>{formatPrice(imovel.price)}</div>

            <div style={actionsGrid}>
              <InterestButton
                propertyId={imovel.id}
                ownerId={1}
                price={Number(imovel.price ?? 0)}
              />

              <Link href="/marketplace" style={btnSecondary}>
                Ver outros imóveis
              </Link>
            </div>

            <div style={infoBox}>
              A maneira mais simples e segura de comprar ou vender imóveis.
              Sem cartório, sem burocracia e com proteção jurídica automática.
            </div>
          </aside>
        </div>
      </div>
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

const topRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
  marginTop: 14,
};

const backLink: React.CSSProperties = {
  display: "inline-flex",
  marginTop: 12,
  color: "#334155",
  fontWeight: 600,
  textDecoration: "none",
};

const contentGrid: React.CSSProperties = {
  marginTop: 22,
  display: "grid",
  gridTemplateColumns: "1.25fr 0.75fr",
  gap: 24,
};

const imageCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 28,
  overflow: "hidden",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: 440,
  objectFit: "cover",
  display: "block",
};

const imageFallback: React.CSSProperties = {
  height: 440,
  display: "grid",
  placeItems: "center",
  color: "#64748b",
  background:
    "linear-gradient(135deg, rgba(226,232,240,0.9), rgba(241,245,249,0.95))",
};

const sideCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 28,
  padding: 26,
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
  alignSelf: "start",
};

const pill: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.10)",
  color: "#475569",
  fontSize: 13,
  fontWeight: 600,
};

const title: React.CSSProperties = {
  margin: "18px 0 0",
  fontSize: 56,
  lineHeight: 0.98,
  fontWeight: 780,
  letterSpacing: "-0.05em",
};

const chipsRow: React.CSSProperties = {
  marginTop: 12,
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const chip: React.CSSProperties = {
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
  marginTop: 22,
  fontSize: 18,
  lineHeight: 1.65,
  color: "#475569",
};

const price: React.CSSProperties = {
  marginTop: 24,
  fontSize: 44,
  fontWeight: 780,
  letterSpacing: "-0.04em",
};

const actionsGrid: React.CSSProperties = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 18px",
  borderRadius: 16,
  background: "#ffffff",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 600,
  border: "1px solid rgba(15,23,42,0.10)",
};

const infoBox: React.CSSProperties = {
  marginTop: 16,
  paddingTop: 16,
  borderTop: "1px solid rgba(15,23,42,0.08)",
  color: "#64748b",
  lineHeight: 1.55,
  fontSize: 14,
};

const errorCard: React.CSSProperties = {
  marginTop: 24,
  background: "rgba(255,255,255,0.9)",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 24,
  padding: 24,
};

const errorTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 32,
  fontWeight: 760,
};

const errorText: React.CSSProperties = {
  marginTop: 12,
  color: "#475569",
  lineHeight: 1.6,
};


