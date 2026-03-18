

import Link from "next/link";
import pool from "@/lib/db";
import InterestButton from "@/app/components/InterestButton";
import ViewCertificateButton from "@/app/components/ViewCertificateButton";
import TrustBadge from "@/app/components/TrustBadge";

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
  userId: number | null;
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

export default async function MarketplacePage() {
  const res = await pool.query<MarketplaceRow>(`
    SELECT
      p.id,
      p.title,
      p.description,
      p.price,
      p.address,
      p.image,
      p.status_diligencia,
      p.user_id AS "userId",
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

  const imoveis = res.rows;

  return (
    <main style={pageBg}>
      <div style={shell}>
        <div style={{ maxWidth: 980 }}>
          <div style={brand}>ImobAI</div>
          <div style={brandSub}>IMOBAI — você no comando.</div>

          <h1 style={heroTitle}>Marketplace</h1>
          <p style={heroText}>
            A maneira mais simples e segura de comprar ou vender imóveis. Sem
            burocracia e com proteção jurídica automática.
          </p>
        </div>

        <div style={grid}>
          {imoveis.map((item) => {
            const imageSrc = item.image?.trim() ? item.image : null;

            return (
              <article key={item.id} style={card}>
                <div style={mediaWrap}>
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.title}
                      style={media}
                    />
                  ) : (
                    <div style={mediaFallback}>Imagem não disponível</div>
                  )}
                </div>

                <div style={content}>
                  <div style={topRow}>
                    <TrustBadge
                      score={item.trust_score ?? undefined}
                      riskLevel={item.risk_level ?? undefined}
                    />
                  </div>

                  <h2 style={title}>{item.title}</h2>

                  <div style={address}>
                    {item.address ?? "Endereço não informado"}
                  </div>

                  <div style={price}>
                    {formatPrice(item.price)}
                  </div>

                  <div style={statusRow}>
                    <span style={statusChip}>
                      {item.status_diligencia ?? "PENDENTE"}
                    </span>
                  </div>

                  <p style={description}>
                    {item.description ?? "Descrição não informada."}
                  </p>

                  <div style={actionsGrid}>
                    <InterestButton
                      propertyId={item.id}
                      ownerId={Number(item.userId ?? 1)}
                      price={Number(item.price ?? 0)}
                    />

                    <Link href={`/imovel/${item.id}`} style={btnSecondary}>
                      Ver imóvel
                    </Link>

                    <Link
                      href={`/diligencia/${item.id}`}
                      style={btnSecondary}
                    >
                      Ver diligência
                    </Link>

                    <ViewCertificateButton
                      tokenReference={item.token_reference ?? null}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

const pageBg = {
  minHeight: "100vh",
  background: "#eef1f4",
  color: "#111827",
};

const shell = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "32px 24px 70px",
};

const brand = {
  fontSize: 28,
  fontWeight: 760,
  letterSpacing: "-0.04em",
};

const brandSub = {
  marginTop: 4,
  fontSize: 15,
  color: "#64748b",
};

const heroTitle = {
  margin: "18px 0 0",
  fontSize: 72,
  lineHeight: 0.98,
  fontWeight: 780,
  letterSpacing: "-0.06em",
};

const heroText = {
  marginTop: 18,
  maxWidth: 980,
  fontSize: 24,
  lineHeight: 1.5,
  color: "#475569",
};

const grid = {
  marginTop: 34,
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 24,
};

const card = {
  display: "grid",
  gridTemplateColumns: "1.15fr 0.85fr",
  gap: 0,
  borderRadius: 30,
  overflow: "hidden",
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
};

const mediaWrap = {
  minHeight: 420,
  background: "#dbe4ee",
};

const media = {
  width: "100%",
  height: "100%",
  minHeight: 420,
  objectFit: "cover" as const,
  display: "block",
};

const mediaFallback = {
  minHeight: 420,
  display: "grid",
  placeItems: "center",
  color: "#64748b",
  background:
    "linear-gradient(135deg, rgba(226,232,240,0.9), rgba(241,245,249,0.95))",
};

const content = {
  padding: 28,
  display: "flex",
  flexDirection: "column" as const,
};

const topRow = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap" as const,
};

const title = {
  margin: "18px 0 0",
  fontSize: 54,
  lineHeight: 0.98,
  fontWeight: 780,
  letterSpacing: "-0.05em",
};

const address = {
  marginTop: 14,
  fontSize: 20,
  color: "#475569",
};

const price = {
  marginTop: 18,
  fontSize: 48,
  fontWeight: 780,
  letterSpacing: "-0.04em",
};

const statusRow = {
  marginTop: 16,
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
};

const statusChip = {
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

const description = {
  marginTop: 18,
  color: "#475569",
  lineHeight: 1.65,
  fontSize: 17,
};

const actionsGrid = {
  marginTop: 24,
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const btnSecondary = {
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


