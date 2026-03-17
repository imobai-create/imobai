import Link from "next/link";
import pool from "@/lib/db";

type PageProps = {
  params: Promise<{ tokenId: string }>;
};

type TrustTokenRow = {
  id: number;
  deal_id: number;
  property_id: number;
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
  property_title: string | null;
  property_address: string | null;
  property_description: string | null;
  property_price: number | string | null;
  property_image: string | null;
  property_status_diligencia: string | null;
  tx_hash: string | null;
};

function formatCurrency(value: number | string | null | undefined) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num) || num <= 0) return "Preço sob consulta";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(num);
}

function riskColor(risk: string | null | undefined) {
  const value = String(risk ?? "").toUpperCase();

  if (value.includes("LOW") || value.includes("BAIX")) {
    return {
      bg: "#ecfdf3",
      border: "#b7ebc6",
      text: "#166534",
      label: "baixo",
    };
  }

  if (value.includes("MEDIUM") || value.includes("MED") || value.includes("MÉD") || value.includes("MEDI")) {
    return {
      bg: "#fff7ed",
      border: "#fed7aa",
      text: "#9a3412",
      label: "médio",
    };
  }

  return {
    bg: "#fef2f2",
    border: "#fecaca",
    text: "#991b1b",
    label: "alto",
  };
}

export default async function TrustTokenPublicPage({ params }: PageProps) {
  const { tokenId } = await params;

  const result = await pool.query<TrustTokenRow>(
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
      t.created_at::text,
      t.updated_at::text,
      p.title AS property_title,
      p.address AS property_address,
      p.description AS property_description,
      p.price AS property_price,
      p.image AS property_image,
      p.status_diligencia AS property_status_diligencia,
      b.tx_hash
    FROM trust_token t
    LEFT JOIN property p
      ON p.id = t.property_id
    LEFT JOIN deal_blockchain_receipt b
      ON b.id = t.blockchain_receipt_id
    WHERE t.token_reference = $1
    LIMIT 1
    `,
    [tokenId]
  );

  const token = result.rows[0];

  if (!token) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f7fafc",
          padding: "40px 20px",
          color: "#0f172a",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Link
            href="/marketplace"
            style={{
              display: "inline-block",
              marginBottom: 24,
              color: "#0f172a",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            ← Voltar
          </Link>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 24,
              padding: 32,
            }}
          >
            <div style={{ fontSize: 14, color: "#64748b", fontWeight: 700 }}>
              TRUST TOKEN PÚBLICO
            </div>

            <h1
              style={{
                margin: "12px 0 0",
                fontSize: 44,
                lineHeight: 1,
                fontWeight: 800,
              }}
            >
              Certificado não encontrado
            </h1>

            <p
              style={{
                marginTop: 16,
                fontSize: 18,
                lineHeight: 1.6,
                color: "#475569",
                maxWidth: 760,
              }}
            >
              O token informado não existe ou ainda não foi publicado.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const risk = riskColor(token.risk_level);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f6fb",
        padding: "28px 20px 60px",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Link
          href="/marketplace"
          style={{
            display: "inline-block",
            marginBottom: 22,
            color: "#0f172a",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Voltar
        </Link>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 30,
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(15,23,42,0.08)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: 0,
            }}
          >
            <div
              style={{
                minHeight: 420,
                background: "#e5e7eb",
                position: "relative",
              }}
            >
              {token.property_image ? (
                <img
                  src={token.property_image}
                  alt={token.property_title ?? "Imóvel"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 420,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    fontSize: 24,
                    fontWeight: 700,
                    background:
                      "linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)",
                  }}
                >
                  Certificado público IMOB.AI
                </div>
              )}
            </div>

            <div
              style={{
                padding: 34,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 24,
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    padding: "10px 14px",
                    borderRadius: 999,
                    background: "#eef2ff",
                    color: "#3730a3",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  Trust Token público
                </div>

                <h1
                  style={{
                    margin: "18px 0 0",
                    fontSize: 52,
                    lineHeight: 0.96,
                    letterSpacing: "-0.05em",
                    fontWeight: 900,
                  }}
                >
                  {token.property_title ?? "Imóvel certificado"}
                </h1>

                <p
                  style={{
                    marginTop: 16,
                    fontSize: 18,
                    color: "#475569",
                    lineHeight: 1.6,
                  }}
                >
                  {token.property_address ?? "Endereço não informado"}
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    padding: 18,
                    borderRadius: 20,
                    background: risk.bg,
                    border: `1px solid ${risk.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: risk.text,
                      letterSpacing: "0.03em",
                    }}
                  >
                    Trust score
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 40,
                      fontWeight: 900,
                      color: risk.text,
                      lineHeight: 1,
                    }}
                  >
                    {token.trust_score ?? "--"}
                  </div>

                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 16,
                      color: risk.text,
                      fontWeight: 700,
                    }}
                  >
                    Risco {risk.label}
                  </div>
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 20,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                    Token
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 18,
                      fontWeight: 800,
                      wordBreak: "break-word",
                    }}
                  >
                    {token.token_reference}
                  </div>
                </div>

                <div
                  style={{
                    padding: 18,
                    borderRadius: 20,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                    Status
                  </div>
                  <div style={{ marginTop: 8, fontSize: 18, fontWeight: 800 }}>
                    {token.status ?? "Não informado"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 26,
              padding: 28,
            }}
          >
            <div style={{ fontSize: 14, color: "#64748b", fontWeight: 800 }}>
              RESUMO DO ATIVO
            </div>

            <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Imóvel
                </div>
                <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>
                  {token.property_title ?? "Não informado"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Endereço
                </div>
                <div style={{ marginTop: 6, fontSize: 17, color: "#334155" }}>
                  {token.property_address ?? "Não informado"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Preço de referência
                </div>
                <div style={{ marginTop: 6, fontSize: 28, fontWeight: 900 }}>
                  {formatCurrency(token.property_price)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Diligência
                </div>
                <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700 }}>
                  {token.property_status_diligencia ?? "Não informado"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Descrição
                </div>
                <div style={{ marginTop: 6, fontSize: 16, color: "#475569", lineHeight: 1.7 }}>
                  {token.property_description ?? "Sem descrição cadastrada."}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 26,
              padding: 28,
            }}
          >
            <div style={{ fontSize: 14, color: "#64748b", fontWeight: 800 }}>
              RASTREABILIDADE
            </div>

            <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Deal ID
                </div>
                <div style={{ marginTop: 6, fontSize: 22, fontWeight: 800 }}>
                  #{token.deal_id}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Property ID
                </div>
                <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800 }}>
                  #{token.property_id}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Network
                </div>
                <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800 }}>
                  {token.network ?? "Não informado"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Versão do score
                </div>
                <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800 }}>
                  {token.score_version ?? "Não informado"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Hash do contrato
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 15,
                    color: "#334155",
                    wordBreak: "break-word",
                  }}
                >
                  {token.contract_hash ?? "Ainda não disponível"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Hash da diligência
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 15,
                    color: "#334155",
                    wordBreak: "break-word",
                  }}
                >
                  {token.diligence_hash ?? "Ainda não disponível"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Hash blockchain
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 15,
                    color: "#334155",
                    wordBreak: "break-word",
                  }}
                >
                  {token.tx_hash ?? "Ainda não disponível"}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>
                  Emitido em
                </div>
                <div style={{ marginTop: 6, fontSize: 16, color: "#334155" }}>
                  {token.created_at ?? "Não informado"}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}







