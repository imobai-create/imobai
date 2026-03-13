import Link from 'next/link';
import pool from '../../../../lib/db';

type PageProps = {
  params: Promise<{ id: string }>;
};

type DealRow = {
  id: number;
  property_id: number;
  buyer_user_id: number;
  seller_user_id: number;
  price: number;
  status: string;
  createdAt?: string;
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

const sectionTitle: React.CSSProperties = {
  margin: '0 0 16px',
  fontSize: 24,
  color: '#0f172a',
};

const infoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
  marginTop: 20,
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

const contractBox: React.CSSProperties = {
  marginTop: 24,
  padding: 24,
  borderRadius: 24,
  background: '#ffffff',
  border: '1px solid #dbe3ef',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
};

const paragraph: React.CSSProperties = {
  fontSize: 17,
  lineHeight: 1.8,
  color: '#334155',
  margin: '0 0 14px',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default async function ContratoPage({ params }: PageProps) {
  const { id } = await params;
  const dealId = Number(id);

  if (!Number.isFinite(dealId)) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={h1}>Negociação inválida</h1>
            <p style={muted}>O identificador da negociação não foi reconhecido.</p>
          </div>
        </div>
      </main>
    );
  }

  const dealRes = await pool.query<DealRow>(
    `
    SELECT
      id,
      property_id,
      buyer_user_id,
      seller_user_id,
      price,
      status,
      "createdAt"
    FROM deal
    WHERE id = $1
    LIMIT 1
    `,
    [dealId]
  );

  const deal = dealRes.rows[0];

  if (!deal) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={h1}>Negociação não encontrada</h1>
            <p style={muted}>Essa negociação ainda não existe ou foi removida.</p>
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
      risk_level
    FROM property
    WHERE id = $1
    LIMIT 1
    `,
    [deal.property_id]
  );

  const property = propertyRes.rows[0];

  if (!property) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href={`/negociacao/${dealId}`} style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={h1}>Imóvel não encontrado</h1>
            <p style={muted}>O imóvel vinculado a esta negociação não foi localizado.</p>
          </div>
        </div>
      </main>
    );
  }

  const createdAtText = deal.createdAt
    ? new Date(deal.createdAt).toLocaleString('pt-BR')
    : 'Não informado';

  return (
    <main style={pageBg}>
      <div style={shell}>
        <Link href={`/negociacao/${dealId}`} style={backLink}>
          ← Voltar para negociação
        </Link>

        <div style={card}>
          <h1 style={h1}>Contrato da negociação</h1>
          <p style={muted}>
            Prévia do contrato digital gerado com base na negociação registrada na IMOBAI.
          </p>

          <div style={infoGrid}>
            <div style={infoCard}>
              <span style={labelStyle}>Negociação</span>
              <span style={valueStyle}>#{deal.id}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Status</span>
              <span style={valueStyle}>{deal.status}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Valor</span>
              <span style={valueStyle}>{formatCurrency(Number(deal.price))}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Criado em</span>
              <span style={valueStyle}>{createdAtText}</span>
            </div>
          </div>

          <div style={contractBox}>
            <h2 style={sectionTitle}>Dados do imóvel</h2>

            <p style={paragraph}>
              <strong>Imóvel:</strong> {property.title}
            </p>

            <p style={paragraph}>
              <strong>Descrição:</strong> {property.description}
            </p>

            <p style={paragraph}>
              <strong>Endereço:</strong> {property.address}, {property.city}
            </p>

            <p style={paragraph}>
              <strong>Preço anunciado:</strong> {formatCurrency(Number(property.price))}
            </p>

            <p style={paragraph}>
              <strong>Status de diligência:</strong>{' '}
              {property.status_diligencia ?? 'Não informado'}
            </p>

            <p style={paragraph}>
              <strong>Score do imóvel:</strong> {property.score ?? 'Não informado'}
            </p>

            <p style={paragraph}>
              <strong>Risco:</strong> {property.risk_level ?? 'Não informado'}
            </p>

            <h2 style={{ ...sectionTitle, marginTop: 28 }}>Cláusulas essenciais</h2>

            <p style={paragraph}>
              1. As partes reconhecem que a presente negociação foi iniciada e registrada na
              plataforma IMOBAI, vinculada ao negócio #{deal.id}.
            </p>

            <p style={paragraph}>
              2. O imóvel objeto desta negociação é <strong>{property.title}</strong>, localizado em{' '}
              <strong>
                {property.address}, {property.city}
              </strong>
              .
            </p>

            <p style={paragraph}>
              3. O valor negociado entre as partes corresponde a{' '}
              <strong>{formatCurrency(Number(deal.price))}</strong>.
            </p>

            <p style={paragraph}>
              4. A efetiva transferência da propriedade dependerá do cumprimento das exigências
              legais e registrais aplicáveis, inclusive os atos cartorários obrigatórios.
            </p>

            <p style={paragraph}>
              5. A IMOBAI atua como infraestrutura digital de negociação, diligência, registro e
              proteção transacional, podendo complementar o fluxo com escrow, score jurídico,
              registro blockchain e Trust Token.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
