

type TrustAiReport = {
  id: number;
  evaluation_id: number;
  headline: string;
  summary_short: string;
  summary_long: string;
  legal_opinion: string;
  recommended_actions: string[] | null;
  confidence_level: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  generated_by: string;
  created_at: string;
};

type Props = {
  propertyId: number;
};

function confidenceLabel(value?: string) {
  if (value === 'HIGH') return 'Alta';
  if (value === 'MEDIUM') return 'Média';
  if (value === 'LOW') return 'Baixa';
  return value || 'N/A';
}

export default async function TrustAnalysisCard({ propertyId }: Props) {
  let report: TrustAiReport | null = null;
  let fetchError = false;

  try {
    const res = await fetch(
      `http://localhost:3000/trust-ai/property/${propertyId}/latest`,
      { cache: 'no-store' }
    );

    if (res.ok) {
      report = await res.json();
    } else {
      fetchError = true;
    }
  } catch {
    fetchError = true;
  }

  if (!report && !fetchError) {
    return null;
  }

  const cardStyle: React.CSSProperties = {
    marginTop: 28,
    padding: 28,
    borderRadius: 24,
    background: '#ffffff',
    border: '1px solid rgba(15,23,42,0.10)',
    boxShadow: '0 12px 32px rgba(15,23,42,0.06)',
  };

  const eyebrowStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 999,
    background: '#f8fafc',
    border: '1px solid rgba(15,23,42,0.08)',
    fontSize: 13,
    fontWeight: 700,
    color: '#334155',
    marginBottom: 16,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.1,
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.03em',
  };

  const subStyle: React.CSSProperties = {
    marginTop: 12,
    marginBottom: 0,
    fontSize: 16,
    lineHeight: 1.7,
    color: '#475569',
  };

  const sectionTitle: React.CSSProperties = {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 800,
    color: '#0f172a',
  };

  const paragraph: React.CSSProperties = {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.8,
    color: '#334155',
  };

  const pillWrap: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  };

  const pill: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 14px',
    borderRadius: 999,
    background: '#f8fafc',
    border: '1px solid rgba(15,23,42,0.08)',
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
  };

  const listStyle: React.CSSProperties = {
    margin: '10px 0 0 18px',
    padding: 0,
    color: '#334155',
    lineHeight: 1.8,
    fontSize: 15,
  };

  if (fetchError) {
    return (
      <section style={cardStyle}>
        <div style={eyebrowStyle}>IMOB.AI LEGAL ANALYSIS</div>
        <h2 style={titleStyle}>Parecer jurídico indisponível</h2>
        <p style={subStyle}>
          O motor de análise ainda não conseguiu carregar o relatório desta
          propriedade.
        </p>
      </section>
    );
  }

  return (
    <section style={cardStyle}>
      <div style={eyebrowStyle}>IMOB.AI LEGAL ANALYSIS</div>

      <h2 style={titleStyle}>{report?.headline || 'Parecer IMOB.AI'}</h2>

      <p style={subStyle}>
        {report?.summary_short ||
          'A análise jurídica automática ainda não gerou um resumo para este ativo.'}
      </p>

      <div style={pillWrap}>
        <span style={pill}>
          Confiança da análise: {confidenceLabel(report?.confidence_level)}
        </span>
        <span style={pill}>
          Motor: {report?.generated_by || 'AI_RULE_LAYER'}
        </span>
      </div>

      <h3 style={sectionTitle}>Parecer jurídico</h3>
      <p style={paragraph}>
        {report?.legal_opinion ||
          'Sem parecer jurídico disponível no momento.'}
      </p>

      <h3 style={sectionTitle}>Análise detalhada</h3>
      <p style={paragraph}>
        {report?.summary_long || 'Sem detalhamento adicional disponível.'}
      </p>

      <h3 style={sectionTitle}>Ações recomendadas</h3>

      {report?.recommended_actions &&
      Array.isArray(report.recommended_actions) &&
      report.recommended_actions.length > 0 ? (
        <ul style={listStyle}>
          {report.recommended_actions.map((action, index) => (
            <li key={`${index}-${action}`}>{action}</li>
          ))}
        </ul>
      ) : (
        <p style={paragraph}>Nenhuma ação recomendada no momento.</p>
      )}
    </section>
  );
}