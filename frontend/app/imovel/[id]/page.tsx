import Link from "next/link";
import InterestButton from "@/app/components/InterestButton";
import TrustPanel from "@/app/components/TrustPanel";
import TrustAnalysisCard from '@/app/components/TrustAnalysisCard';
import TrustBadge from "@/app/components/TrustBadge";
import ViewCertificateButton from "@/app/components/ViewCertificateButton";

type Property = {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  userId: number;
  image: string | null;
  status_diligencia: string;
  url?: string | null;
};

function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default async function ImovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!Number.isFinite(propertyId)) {
    return (
      <main style={{ minHeight: "100vh", background: "#f3f4f6", padding: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 700 }}>ID inválido</h1>
        <Link href="/marketplace">Voltar</Link>

      </main>
    );
  }
  const res = await fetch(`http://localhost:3001/api/imoveis/${propertyId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main style={{ minHeight: "100vh", background: "#f3f4f6", padding: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 700 }}>Imóvel não encontrado</h1>
        <Link href="/marketplace">Voltar</Link>
      </main>
    );
  }

  const imovel = (await res.json()) as Property;
  const imageSrc = imovel.image ? `/uploads/${imovel.image}` : null;

  return (
    <main style={{ minHeight: "100vh", background: "#f3f4f6", color: "#111827" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 64px" }}>
        <Link href="/marketplace" style={{ color: "#475569", textDecoration: "none" }}>     

<div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
    alignItems: 'center',
  }}
>
  <TrustBadge
    score={undefined}
    riskLevel={undefined}
  />
  <ViewCertificateButton tokenReference={"IMOB-TT-1-1773277112478"} />
</div>

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
          <div>
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
                {brl(Number(imovel.price || 0))}
              </div>

              <div style={{ marginTop: 18 }}>
                <InterestButton
                  propertyId={imovel.id}
                  ownerId={imovel.userId}
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