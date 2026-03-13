import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#eef1f4", color: "#111827" }}>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "26px 24px 70px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            padding: "10px 0 24px",
          }}
        >
          <div>
            <div style={{ fontSize: 28, fontWeight: 760, letterSpacing: "-0.04em" }}>ImobAI</div>
            <div style={{ marginTop: 4, fontSize: 15, color: "#64748b" }}>
              IMOBAI — você no comando.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="#como-funciona" style={navLink}>Como funciona</a>
            <a href="#seguranca" style={navLink}>Segurança</a>
            <a href="#planos" style={navLink}>Planos</a>
            <Link href="/marketplace" style={btnSecondary}>Marketplace</Link>
            <Link href="/vender" style={btnPrimary}>Vender imóvel</Link>
          </div>
        </header>

        <div
          style={{
            borderRadius: 34,
            padding: 36,
            background: "rgba(255,255,255,0.76)",
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 22px 50px rgba(15,23,42,0.08)",
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
              fontWeight: 600,
            }}
          >
            Plataforma em evolução — MVP operando
          </div>

          <h1
            style={{
              margin: "22px 0 0",
              fontSize: 72,
              lineHeight: 0.98,
              fontWeight: 780,
              letterSpacing: "-0.06em",
              maxWidth: 940,
            }}
          >
            A maneira mais simples e segura de comprar ou vender imóveis.
          </h1>

          <p
            style={{
              marginTop: 24,
              fontSize: 24,
              lineHeight: 1.5,
              color: "#475569",
              maxWidth: 980,
            }}
          >
            Sem cartório, sem burocracia e com proteção jurídica automática.
            O proprietário anuncia, o comprador negocia dentro da plataforma
            e a diligência cria confiança real antes do fechamento.
          </p>

          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/marketplace" style={btnPrimary}>Explorar imóveis</Link>
            <Link href="/vender" style={btnSecondary}>Cadastrar / vender imóvel</Link>
            <a href="#como-funciona" style={linkArrow}>Ver como funciona →</a>
          </div>

          <div
            style={{
              marginTop: 34,
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            <Metric title="1%" subtitle="taxa no fechamento" />
            <Metric title="3 camadas" subtitle="diligência (MVP)" />
            <Metric title="hash" subtitle="prova digital" />
            <Metric title="escrow" subtitle="pronto p/ evoluir" />
          </div>
        </div>

        <section id="como-funciona" style={{ marginTop: 42 }}>
          <h2 style={h2}>Como funciona</h2>
          <p style={sub}>
            Um fluxo simples, claro e guiado — com segurança, rastreabilidade e linguagem fácil para o público geral.
          </p>

          <div style={stepsGrid}>
            <Step
              n="01"
              title="O proprietário cadastra o imóvel"
              text="Ele informa os dados do imóvel, envia as fotos e, em seguida, a plataforma registra o anúncio e inicia a análise."
            />
            <Step
              n="02"
              title="A diligência começa"
              text="A plataforma organiza documentos, histórico e validações. Isso dá mais segurança a quem quer comprar e protege quem quer vender."
            />
            <Step
              n="03"
              title="O comprador fala com o proprietário"
              text="A conversa acontece dentro da plataforma. Nada de contato exposto logo no início."
            />
            <Step
              n="04"
              title="Contrato digital e assinatura"
              text="Quando a negociação avança, o contrato digital entra em cena com trilha, hash e registro do aceite."
            />
          </div>
        </section>

        <section id="seguranca" style={{ marginTop: 42 }}>
          <h2 style={h2}>Segurança para quem transaciona</h2>
          <p style={sub}>
            O foco da IMOBAI é reduzir o espaço dos intermediários ruins, da burocracia desnecessária e da insegurança documental.
          </p>

          <div style={stepsGrid}>
            <InfoCard title="Diligência documentada">
              Tudo fica registrado em etapas, com rastreabilidade.
            </InfoCard>
            <InfoCard title="Hash do contrato">
              Prova digital do conteúdo assinado, para dar integridade ao documento.
            </InfoCard>
            <InfoCard title="Contato protegido">
              A negociação nasce dentro da plataforma, com menos exposição inicial.
            </InfoCard>
            <InfoCard title="Base pronta para escrow">
              O modelo já prepara a evolução para pagamento seguro.
            </InfoCard>
          </div>
        </section>

        <section id="planos" style={{ marginTop: 42 }}>
          <h2 style={h2}>Entrada rápida</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
            <Link href="/marketplace" style={btnPrimary}>Entrar no marketplace</Link>
            <Link href="/vender" style={btnSecondary}>Anunciar meu imóvel</Link>
            <Link href="/planos" style={btnSecondary}>Ver planos</Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 20,
        padding: 20,
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 750, letterSpacing: "-0.04em" }}>{title}</div>
      <div style={{ marginTop: 8, color: "#64748b" }}>{subtitle}</div>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 24,
        padding: 24,
      }}
    >
      <div style={{ color: "#64748b", fontSize: 13, fontWeight: 700 }}>{n}</div>
      <div style={{ marginTop: 10, fontSize: 28, fontWeight: 720, lineHeight: 1.1 }}>{title}</div>
      <div style={{ marginTop: 14, color: "#475569", lineHeight: 1.65, fontSize: 17 }}>{text}</div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 24,
        padding: 24,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 720 }}>{title}</div>
      <div style={{ marginTop: 10, color: "#475569", lineHeight: 1.65, fontSize: 17 }}>{children}</div>
    </div>
  );
}

const stepsGrid: React.CSSProperties = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 18,
};

const h2: React.CSSProperties = {
  margin: 0,
  fontSize: 44,
  fontWeight: 760,
  letterSpacing: "-0.04em",
};

const sub: React.CSSProperties = {
  marginTop: 12,
  fontSize: 18,
  color: "#475569",
  lineHeight: 1.6,
  maxWidth: 920,
};

const navLink: React.CSSProperties = {
  color: "#475569",
  textDecoration: "none",
  fontWeight: 600,
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 52,
  padding: "0 18px",
  borderRadius: 16,
  background: "#0f172a",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 600,
  border: "1px solid rgba(0,0,0,0.08)",
};

const btnSecondary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 52,
  padding: "0 18px",
  borderRadius: 16,
  background: "rgba(255,255,255,0.82)",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 600,
  border: "1px solid rgba(15,23,42,0.10)",
};

const linkArrow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 52,
  padding: "0 8px",
  color: "#111827",
  textDecoration: "none",
  fontWeight: 600,
};


