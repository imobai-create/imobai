import Link from "next/link";
import pool from "@/lib/db";
import ViewCertificateButton from "../components/ViewCertificateButton";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ImovelRow = {
  id: number;
  title: string;
  description: string | null;
  price: number | string;
  address: string;
  image: string | null;
  status_diligencia: string | null;
  trust_score: number | null;
  risk_level: string | null;
  token_reference: string | null;
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

function getScoreFromStatus(status?: string | null) {
  const s = String(status ?? "PENDENTE").toUpperCase();

  if (s.includes("APROV")) {
    return { score: 86, risco: "baixo" as const, cor: "#15803d", fundo: "#ecfdf5" };
  }

  if (s.includes("PENDENTE")) {
    return { score: 50, risco: "medio" as const, cor: "#b45309", fundo: "#fffbeb" };
  }

  if (s.includes("REPROV") || s.includes("RISCO") || s.includes("ALERTA")) {
    return { score: 28, risco: "alto" as const, cor: "#b91c1c", fundo: "#fef2f2" };
  }

  return { score: 50, risco: "medio" as const, cor: "#b45309", fundo: "#fffbeb" };
}

export default async function MarketplacePage() {
 const res = await pool.query(
  `
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
    LEFT JOIN trust_token t
    on t.property_id = p.id
      SELECT
        trust_score,
        risk_level,
        token_reference
      FROM trust_token
      WHERE property_id = p.id
      ORDER BY id DESC
      LIMIT 1
    ) tt ON true
    ORDER BY p.id DESC
  `
);
  console.log(res.rows)

  const imoveis = res.rows;
console.log("MARKETPLACE_ROWS =", res.rows);
console.log("MARKETPLACE_COUNT =", res.rows.length);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        color: "#0f172a",
        padding: "28px 20px 60px",
      }}
    >
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 24,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>ImobAI</div>
            <div style={{ fontSize: 15, color: "#64748b", marginTop: 4 }}>
              IMOBAI — você no comando.
            </div>

            <h1
              style={{
                margin: "18px 0 0",
                fontSize: 64,
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
                fontWeight: 800,
              }}
            >
              Marketplace
            </h1>

            <p
              style={{
                marginTop: 18,
                maxWidth: 860,
                fontSize: 22,
                lineHeight: 1.5,
                color: "#334155",
              }}
            >
              A maneira mais simples e segura de comprar ou vender imóveis.
              Sem cartório, sem burocracia e com proteção jurídica automática. É voce no comando.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 10,
            }}
          >
            <Link href="/vender" style={btnPrimary}>
              Cadastrar / vender imóvel
            </Link>

            <Link href="/" style={btnSecondary}>
              Voltar
            </Link>
          </div>
        </div>

        {imoveis.length === 0 ? (
          <div
            style={{
              background: "#fff",
              border: "1px solid rgba(15,23,42,0.08)",
              borderRadius: 28,
              padding: 32,
              boxShadow: "0 20px 45px rgba(15,23,42,0.06)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 28 }}>Nenhum imóvel publicado ainda</h2>
            <p style={{ marginTop: 12, color: "#64748b", fontSize: 18 }}>
              Assim que o primeiro proprietário cadastrar um imóvel, ele aparece aqui.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 26 }}>
            {imoveis.map((item) => {
              const statusLabel = String(item.status_diligencia ?? "PENDENTE").toUpperCase();
              const scoreInfo = getScoreFromStatus(item.status_diligencia);

              return (
                <article
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.15fr 0.85fr",
                    background: "#ffffff",
                    borderRadius: 34,
                    overflow: "hidden",
                    border: "1px solid rgba(15,23,42,0.08)",
                    boxShadow: "0 22px 48px rgba(15,23,42,0.08)",
                  }}
                >
                  <div
                    style={{
                      minHeight: 620,
                      background: "#e5e7eb",
                      position: "relative",
                    }}
                  >
                     

<img
  src={
    String(item.image).startsWith("http")
      ? String(item.image)
      : `http://localhost:3000/uploads/${String(item.image).replace(/^\/+/, "")}`
  }
  alt={item.title}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }}
/>
                      <div
                        style={{
                          minHeight: 620,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                          color: "#64748b",
                          background:
                            "linear-gradient(180deg, rgba(226,232,240,1) 0%, rgba(241,245,249,1) 100%)",
                        }}
                      >
                        Imagem do imóvel
                      </div>
                    
                  </div>

                  <div
                    style={{
                      padding: 38,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      background: "#fff",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 14px",
                          borderRadius: 999,
                          fontSize: 14,
                          fontWeight: 700,
                          background: "#f7efe7",
                          color: "#9a6b3a",
                        }}
                      >
                        {statusLabel}
                      </div>

                      <h2
                        style={{
                          margin: "22px 0 0",
                          fontSize: 58,
                          lineHeight: 0.92,
                          letterSpacing: "-0.06em",
                          fontWeight: 820,
                          color: "#0f172a",
                        }}
                      >
                        {item.title}
                      </h2>

                      <p
                        style={{
                          marginTop: 18,
                          color: "#64748b",
                          fontSize: 18,
                          lineHeight: 1.45,
                        }}
                      >
                        {item.address}
                      </p>

                      <div style={{ marginTop: 28 }}>
                        <div style={{ fontSize: 16, color: "#64748b", fontWeight: 500 }}>
                          Preço
                        </div>

                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 62,
                            lineHeight: 0.95,
                            letterSpacing: "-0.06em",
                            fontWeight: 850,
                            color: "#020617",
                          }}
                        >
                          {formatPrice(item.price)}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 24,
                          padding: 18,
                          borderRadius: 20,
                          background: scoreInfo.fundo,
                          border: `1px solid ${scoreInfo.cor}22`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: scoreInfo.cor,
                            textTransform: "uppercase",
                            letterSpacing: "0.02em",
                          }}
                        >
                          Score jurídico
                        </div>

                        <div
                          style={{
                            marginTop: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 34,
                              fontWeight: 800,
                              letterSpacing: "-0.05em",
                              color: scoreInfo.cor,
                            }}
                          >
                            {scoreInfo.score}
                          </span>

                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: scoreInfo.cor,
                            }}
                          >
                            {scoreInfo.risco === "baixo" && "Baixo risco"}
                            {scoreInfo.risco === "medio" && "Atenção"}
                            {scoreInfo.risco === "alto" && "Alto risco"}
                          </span>
                        </div>
                      </div>

                      <p
                        style={{
                          marginTop: 22,
                          fontSize: 17,
                          lineHeight: 1.55,
                          color: "#475569",
                          maxWidth: 480,
                        }}
                      >
                        Os contatos ficam protegidos até a assinatura do contrato.
                        A conversa acontece dentro da negociação.
                      </p>
                    </div>

                    <div
                      style={{
                        marginTop: 30,
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <Link href={`/negociacao/${item.id}`} style={btnPrimary}>
                        Falar com o proprietário
                      </Link>

                      <Link href={`/imovel/${item.id}`} style={btnSecondary}>
                        Ver imóvel
                      </Link>

                      <Link href={`/diligencia/${item.id}`} style={btnSecondary}>
                        Ver diligência
                      </Link>

<ViewCertificateButton tokenReference={item.token_reference ?? null} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "#0f172a",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 16,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 8px 20px rgba(15,23,42,0.18)",
};

const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 54,
  padding: "0 22px",
  borderRadius: 16,
  background: "#ffffff",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 16,
  border: "1px solid rgba(15,23,42,0.12)",
};
