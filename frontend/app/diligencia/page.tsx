
import Link from 'next/link';
import pool from '../../lib/db';

type PageProps = {
  params: Promise<{ id: string }>;
};

type PropertyRow = {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  image: string | null;
  status_diligencia: string | null;
  score: number | null;
  risk_level: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const pageBg: React.CSSProperties = {
  minHeight: '100vh',
  background: '#eef2f7',
  color: '#0f172a',
  padding: '28px 20px 60px',
};

const shell: React.CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
};

const backLink: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  textDecoration: 'none',
  color: '#334155',
  fontWeight: 700,
  marginBottom: 20,
};

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(15,23,42,0.08)',
  borderRadius: 32,
  padding: 28,
  boxShadow: '0 20px 60px rgba(15,23,42,0.10)',
};

const h1: React.CSSProperties = {
  margin: 0,
  fontSize: 48,
  lineHeight: 1,
  letterSpacing: '-0.04em',
  color: '#0f172a',
};

const muted: React.CSSProperties = {
  color: '#64748b',
  fontSize: 18,
  lineHeight: 1.6,
};

const infoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
  marginTop: 22,
};

const infoCard: React.CSSProperties = {
  padding: '16px 18px',
  borderRadius: 20,
  background: '#f8fafc',
  border: '1px solid #dbe3ef',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#64748b',
  marginBottom: 6,
};

const valueStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#0f172a',
};

const sectionBox: React.CSSProperties = {
  marginTop: 24,
  padding: 24,
  borderRadius: 24,
  background: '#ffffff',
  border: '1px solid #dbe3ef',
};

const paragraph: React.CSSProperties = {
  fontSize: 17,
  lineHeight: 1.75,
  color: '#334155',
  margin: '0 0 14px',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getRiskBadgeStyle(riskLevel: string | null): React.CSSProperties {
  const risk = (riskLevel || '').toUpperCase();

  if (risk === 'LOW') {
    return {
      display: 'inline-flex',
      padding: '8px 14px',
      borderRadius: 999,
      background: '#ecfdf5',
      color: '#166534',
      fontWeight: 800,
      fontSize: 13,
    };
  }

  if (risk === 'MEDIUM') {
    return {
      display: 'inline-flex',
      padding: '8px 14px',
      borderRadius: 999,
      background: '#fffbeb',
      color: '#b45309',
      fontWeight: 800,
      fontSize: 13,
    };
  }

  return {
    display: 'inline-flex',
    padding: '8px 14px',
    borderRadius: 999,
    background: '#fef2f2',
    color: '#991b1b',
    fontWeight: 800,
    fontSize: 13,
  };
}

export default async function DiligenciaPage({ params }: PageProps) {
  const { id } = await params;
  const propertyId = Number(id);

  if (!Number.isFinite(propertyId)) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={h1}>Imóvel inválido</h1>
            <p style={muted}>O identificador informado não foi reconhecido.</p>
          </div>
        </div>
      </main>
    );
  }

  const propertyRes = await pool.query<PropertyRow>(
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
      risk_level,
      "createdAt",
      "updatedAt"
    FROM property
    WHERE id = $1
    LIMIT 1
    `,
    [propertyId]
  );

  const property = propertyRes.rows[0];

  if (!property) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={h1}>Imóvel não encontrado</h1>
            <p style={muted}>Não foi possível localizar este imóvel para análise.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageBg}>
      <div style={shell}>
        <Link href={`/imovel/${property.id}`} style={backLink}>
          ← Voltar para o imóvel
        </Link>

        <div style={card}>
          <h1 style={h1}>Diligência do imóvel</h1>
          <p style={muted}>
            Painel resumido da diligência e do score de confiança do ativo dentro da IMOBAI.
          </p>

          <div style={infoGrid}>
            <div style={infoCard}>
              <span style={labelStyle}>Imóvel</span>
              <span style={valueStyle}>#{property.id}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Preço</span>
              <span style={valueStyle}>{formatCurrency(Number(property.price))}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Status da diligência</span>
              <span style={valueStyle}>
                {property.status_diligencia ?? 'Não informado'}
              </span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Trust score</span>
              <span style={valueStyle}>{property.score ?? 'Não informado'}</span>
            </div>
          </div>

          <div style={sectionBox}>
            <div style={{ marginBottom: 18 }}>
              <span style={getRiskBadgeStyle(property.risk_level)}>
                Risco {property.risk_level ?? 'HIGH'}
              </span>
            </div>

            <p style={paragraph}>
              <strong>Título:</strong> {property.title}
            </p>

            <p style={paragraph}>
              <strong>Descrição:</strong> {property.description}
            </p>

            <p style={paragraph}>
              <strong>Endereço:</strong> {property.address}, {property.city}
            </p>

            <p style={paragraph}>
              <strong>Status atual da diligência:</strong>{' '}
              {property.status_diligencia ?? 'Não informado'}
            </p>

            <p style={paragraph}>
              <strong>Score do ativo:</strong> {property.score ?? 'Não informado'}
            </p>

            <p style={paragraph}>
              <strong>Nível de risco:</strong> {property.risk_level ?? 'Não informado'}
            </p>

            <p style={paragraph}>
              Esta tela foi ajustada para usar diretamente a tabela <strong>property</strong>,
              que é onde seu projeto hoje guarda os campos de diligência, score e risco.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}



