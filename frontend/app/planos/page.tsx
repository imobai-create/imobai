



import Link from "next/link";

export default function PlanosPage() {
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
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>ImobAI</div>
          <div style={{ fontSize: 15, color: "#64748b", marginTop: 4 }}>
            IMOBAI — você no comando.
          </div>
        </div>

        <section style={heroCard}>
          <div style={{ flex: 1, minWidth: 320 }}>
            <div style={pill}>Planos da plataforma</div>

            <h1 style={h1}>Planos</h1>

            <p style={muted}>
              Quem quiser mais poder dentro da plataforma pode assinar
              mensalmente, sem fidelidade. Isso libera mais ferramentas de
              diligência, modelos e recursos de acompanhamento.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/#planos" style={btnPrimary}>
              Ver planos na página inicial
            </Link>

            <Link href="/" style={btnSecondary}>
              Voltar
            </Link>
          </div>
        </section>

        <section style={grid}>
          <article style={planCard}>
            <div style={planBadge}>Essencial</div>
            <h2 style={planTitle}>R$ 0/mês</h2>
            <ul style={list}>
              <li>Acesso ao marketplace</li>
              <li>Ver detalhes do imóvel</li>
              <li>Criar negociação e chat</li>
              <li>Diligência básica</li>
            </ul>
            <Link href="/marketplace" style={btnPrimary}>
              Começar
            </Link>
          </article>

          <article style={planCard}>
            <div style={planBadge}>Pro</div>
            <h2 style={planTitle}>R$ 49/mês</h2>
            <ul style={list}>
              <li>Mais imóveis por busca</li>
              <li>Diligência guiada passo a passo</li>
              <li>Modelos de contrato</li>
              <li>Alertas e recomendações</li>
            </ul>
            <button style={btnGhost} disabled>
              Assinar Pro em breve
            </button>
          </article>

          <article style={planCard}>
            <div style={planBadge}>Ultra</div>
            <h2 style={planTitle}>R$ 99/mês</h2>
            <ul style={list}>
              <li>Diligência completa</li>
              <li>Ferramentas avançadas de validação</li>
              <li>Checklists ampliados</li>
              <li>Preparação para escrow</li>
            </ul>
            <button style={btnGhost} disabled>
              Assinar Ultra em breve
            </button>
          </article>
        </section>
      </div>
    </main>
  );
}

const heroCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 28,
  padding: 28,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 20px 45px rgba(15,23,42,0.06)",
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  flexWrap: "wrap",
};

const grid: React.CSSProperties = {
  marginTop: 24,
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 18,
};

const planCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: 24,
  padding: 24,
  border: "1px solid rgba(15,23,42,0.08)",
  boxShadow: "0 16px 40px rgba(15,23,42,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const pill: React.CSSProperties = {
  display: "inline-flex",
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
  fontSize: 58,
  lineHeight: 0.95,
  letterSpacing: "-0.05em",
  fontWeight: 820,
  color: "#0f172a",
};

const muted: React.CSSProperties = {
  marginTop: 14,
  color: "#64748b",
  fontSize: 18,
  lineHeight: 1.55,
  maxWidth: 760,
};

const planBadge: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  padding: "8px 12px",
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid rgba(15,23,42,0.08)",
  color: "#334155",
  fontSize: 13,
  fontWeight: 700,
};

const planTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 34,
  lineHeight: 1,
  letterSpacing: "-0.04em",
  fontWeight: 820,
};

const list: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  color: "#334155",
  lineHeight: 1.8,
  fontSize: 16,
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  padding: "0 20px",
  borderRadius: 16,
  background: "#0f172a",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(15,23,42,0.08)",
};

const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 52,
  padding: "0 20px",
  borderRadius: 16,
  background: "#fff",
  color: "#0f172a",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(15,23,42,0.12)",
};

const btnGhost: React.CSSProperties = {
  minHeight: 52,
  padding: "0 20px",
  borderRadius: 16,
  background: "#e2e8f0",
  color: "#64748b",
  fontWeight: 700,
  border: "1px solid rgba(15,23,42,0.08)",
};








