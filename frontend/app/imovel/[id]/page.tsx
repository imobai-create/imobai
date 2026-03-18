import Link from "next/link";
import pool from "@/lib/db";
import InterestButton from "@/app/components/InterestButton";
import TrustPanel from "@/app/components/TrustPanel";
import TrustAnalysisCard from '@/app/components/TrustAnalysisCard';
import TrustBadge from "@/app/components/TrustBadge";
import ViewCertificateButton from "@/app/components/ViewCertificateButton";

type PageProps = {
  params: Promise<{ id: string }>;
};
type ImovelRow = {
  id: number;
  title: string;
  description: string | null;
  price: number | string;
  address: string;
  city: string | null;
  image: string | null;
  status_diligencia: string | null;
  score: number | null;
  risk_level: string | null;
  userId?: number | null;
};
type TrustTokenRow = {
  token_reference: string;
  trust_score: number | null;
  risk_level: string | null;
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

export default async function ImovelPage({ params }: PageProps) {
  const { id } = await params;
  const imovelId = Number(id);

  if (!Number.isFinite(imovelId)) {
    return (
      <main style={{ padding: 40 }}>
        <h1>ID inválido</h1>
      </main>
    );
  }

  const res = await pool.query<ImovelRow>(
    `
    SELECT
      id,
      title,
      description,
      price,
      address,
      city,
      image,
      status_diligencia,
      score,
      risk_level
    FROM property
    WHERE id = $1
    LIMIT 1
    `,
    [imovelId]
  );

  if (res.rows.length === 0) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Imóvel não encontrado</h1>
      </main>
    );
  }

  const imovel = res.rows[0];

const propertyId = imovel.id;
const imageSrc =
  imovel.image && String(imovel.image).trim() !== ""
    ? String(imovel.image)
    : "https://images.unsplash.com/photo-1568605114967-8130f3a36994";

  const trustTokenRes = await pool.query<TrustTokenRow>(
  `
    SELECT
      token_reference,
      trust_score,
      risk_level
    FROM trust_token
    WHERE property_id = $1
    ORDER BY id DESC
    LIMIT 1
  `,
  [imovel.id]
);

const trustToken = trustTokenRes.rows[0] ?? null;

  
return (
  <main style={{ minHeight: "100vh", background: "#eef1f4", color: "#111827" }}>
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 24px 70px" }}></div>
<div
  style={{
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 14,
  }}
>
  <TrustBadge
    score={imovel.score ?? undefined}
    riskLevel={imovel.risk_level ?? undefined}
  />

  <ViewCertificateButton tokenReference={"IMOB-TT-2-TESTE"} />
</div>

<Link href="/marketplace" style={{ display: "inline-flex", marginTop: 12 }}>
  ← Voltar
</Link>

<div
  style={{
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 24,
  }}
>
  <div
    style={{
      background: "rgba(255,255,255,0.88)",
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    }}
  >
<div
  style={{
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 14,
  }}
>
  <TrustBadge
    score={imovel.score ?? undefined}
    riskLevel={imovel.risk_level ?? undefined}
  />

  <ViewCertificateButton tokenReference={"IMOB-TT-1-1773277112478"} />
</div>

<Link href="/marketplace" style={{ display: "inline-flex", marginTop: 12 }}>
  ← Voltar
</Link>

<div
  style={{
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 24,
  }}
>
  <div
    style={{
      background: "rgba(255,255,255,0.88)",
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 28,
      overflow: "hidden",
      boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    }}
  >

              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imovel.title}
                  style={{
                    width: "100%",
                    height: 440,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: 440,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#e5e7eb",
                    color: "#6b7280",
                  }}
                >
                  Sem imagem
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: 20,
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: 28,
                padding: 28,
                boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(15,23,42,0.10)",
                  color: "#475569",
                  fontSize: 13,
                  marginBottom: 18,
                }}
              >
                IMOBAI — você no comando.
              </div>

              <h1
                style={{
                  fontSize: 48,
                  lineHeight: 1.02,
                  fontWeight: 750,
                  margin: 0,
                  letterSpacing: "-0.04em",
                }}
              >
                {imovel.title}
              </h1>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span style={pillStyle}>ID {imovel.id}</span>
                <span style={pillStyle}>Diligência: {imovel.status_diligencia}</span>
                <span style={pillStyle}>{imovel.address}</span>
              </div>

              <p
                style={{
                  marginTop: 24,
                  fontSize: 18,
                  lineHeight: 1.65,
                  color: "#475569",
                }}
              >
                {imovel.description}
              </p>
               <TrustPanel propertyId={propertyId} />
               <TrustAnalysisCard propertyId={propertyId} />
            </div>
          </div>

          <aside>
            <div
              style={{
                position: "sticky",
                top: 24,
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(15,23,42,0.08)",
                borderRadius: 28,
                padding: 24,
                boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ color: "#64748b", fontSize: 12 }}>Preço</div>
              <div
                style={{
                  fontSize: 40,
                  fontWeight: 750,
                  letterSpacing: "-0.04em",
                  marginTop: 6,
                }}
              >
                

{formatPrice(Number(imovel.price || 0))}

<InterestButton
  propertyId={imovel.id}
  ownerId={1}
  price={Number(imovel.price || 0)}
/>
              </div>

              <Link
                href="/marketplace"
                style={{
                  marginTop: 12,
                  display: "flex",
                  width: "100%",
                  height: 52,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                  border: "1px solid rgba(15,23,42,0.10)",
                  background: "rgba(255,255,255,0.8)",
                  color: "#111827",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Ver outros imóveis
              </Link>

              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(15,23,42,0.08)",
                  color: "#64748b",
                  lineHeight: 1.55,
                  fontSize: 14,
                }}
              >
                A maneira mais simples e segura de comprar ou vender imóveis. Sem cartório, sem burocracia e com proteção jurídica automática.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "rgba(255,255,255,0.86)",
  color: "#475569",
  fontSize: 13,
};