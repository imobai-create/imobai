


import Link from 'next/link'
import pool from '../../../lib/db'

type PageProps = {
  params: Promise<{ tokenId: string }>
}

type TrustTokenRow = {
  id: number
  deal_id: number
  property_id: number
  buyer_user_id: number
  seller_user_id: number
  trust_score: number
  risk_level: string
  score_version: string
  contract_hash: string | null
  diligence_hash: string | null
  blockchain_receipt_id: number | null
  network: string
  token_reference: string
  status: string
  created_at: string
  updated_at: string
}

type PropertyRow = {
  id: number
  title: string
  description: string
  address: string
  city: string
  price: number
}

const pageBg: React.CSSProperties = {
  minHeight: '100vh',
  background: '#eef2f7',
  color: '#0f172a',
  padding: '28px 20px 60px',
}

const shell: React.CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
}

const backLink: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  textDecoration: 'none',
  color: '#334155',
  fontWeight: 700,
  marginBottom: 20,
}

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(15,23,42,0.08)',
  borderRadius: 32,
  padding: 28,
  boxShadow: '0 20px 60px rgba(15,23,42,0.10)',
}

const h1: React.CSSProperties = {
  margin: 0,
  fontSize: 48,
  lineHeight: 1,
  letterSpacing: '-0.04em',
  color: '#0f172a',
}

const muted: React.CSSProperties = {
  color: '#64748b',
  fontSize: 18,
  lineHeight: 1.6,
}

const infoGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
  marginTop: 22,
}

const infoCard: React.CSSProperties = {
  padding: '16px 18px',
  borderRadius: 20,
  background: '#f8fafc',
  border: '1px solid #dbe3ef',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#64748b',
  marginBottom: 6,
}

const valueStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  color: '#0f172a',
  wordBreak: 'break-word',
}

function getRiskBadgeStyle(riskLevel?: string): React.CSSProperties {
  const risk = (riskLevel || '').toUpperCase()

  if (risk === 'LOW') {
    return {
      display: 'inline-flex',
      padding: '8px 14px',
      borderRadius: 999,
      background: '#ecfdf5',
      color: '#166534',
      fontWeight: 800,
      fontSize: 13,
    }
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
    }
  }

  return {
    display: 'inline-flex',
    padding: '8px 14px',
    borderRadius: 999,
    background: '#fef2f2',
    color: '#991b1b',
    fontWeight: 800,
    fontSize: 13,
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default async function TrustTokenPublicPage({ params }: PageProps) {
  const { tokenId } = await params

  const tokenRes = await pool.query<TrustTokenRow>(
    `
    SELECT *
    FROM trust_token
    WHERE token_reference = $1
    LIMIT 1
    `,
    [tokenId]
  )

  const token = tokenRes.rows[0]

  if (!token) {
    return (
      <main style={pageBg}>
        <div style={shell}>
          <Link href="/marketplace" style={backLink}>
            ← Voltar
          </Link>

          <div style={card}>
            <h1 style={h1}>Trust Token não encontrado</h1>
            <p style={muted}>O certificado informado não existe ou foi removido.</p>
          </div>
        </div>
      </main>
    )
  }

  const propertyRes = await pool.query<PropertyRow>(
    `
    SELECT
      id,
      title,
      description,
      address,
      city,
      price
    FROM property
    WHERE id = $1
    LIMIT 1
    `,
    [token.property_id]
  )

  const property = propertyRes.rows[0]

  return (
    <main style={pageBg}>
      <div style={shell}>
        <Link href={`/negociacao/${token.deal_id}`} style={backLink}>
          ← Voltar para negociação
        </Link>

        <div style={card}>
          <h1 style={h1}>IMOBAI Trust Certificate</h1>
          <p style={muted}>
            Certificado digital público da transação registrada pela infraestrutura de confiança da IMOBAI.
          </p>

          <div style={{ marginTop: 18 }}>
            <span style={getRiskBadgeStyle(token.risk_level)}>
              Risco {token.risk_level}
            </span>
          </div>

          <div style={infoGrid}>
            <div style={infoCard}>
              <span style={labelStyle}>Token</span>
              <span style={valueStyle}>{token.token_reference}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Negociação</span>
              <span style={valueStyle}>#{token.deal_id}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Imóvel</span>
              <span style={valueStyle}>#{token.property_id}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Trust score</span>
              <span style={valueStyle}>{token.trust_score} / 100</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Rede</span>
              <span style={valueStyle}>{token.network}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Status</span>
              <span style={valueStyle}>{token.status}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Comprador</span>
              <span style={valueStyle}>User #{token.buyer_user_id}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Vendedor</span>
              <span style={valueStyle}>User #{token.seller_user_id}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Hash do contrato</span>
              <span style={valueStyle}>{token.contract_hash || 'Não informado'}</span>
            </div>

            <div style={infoCard}>
              <span style={labelStyle}>Emitido em</span>
              <span style={valueStyle}>
                {new Date(token.created_at).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          {property ? (
            <div
              style={{
                marginTop: 24,
                padding: 24,
                borderRadius: 24,
                background: '#ffffff',
                border: '1px solid #dbe3ef',
              }}
            >
              <h2 style={{ marginTop: 0, fontSize: 24 }}>Imóvel vinculado</h2>
              <p style={muted}>
                <strong>{property.title}</strong>
              </p>
              <p style={muted}>{property.description}</p>
              <p style={muted}>
                {property.address}, {property.city}
              </p>
              <p style={muted}>
                Valor de referência: <strong>{formatCurrency(Number(property.price))}</strong>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}







