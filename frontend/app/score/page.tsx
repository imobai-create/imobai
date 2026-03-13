'use client';

import { useMemo, useState } from 'react';

type PersonType = 'PF' | 'PJ';

type ScoreResponse = {
  score?: number;
  riskLevel?: string;
  message?: string;
  details?: unknown;
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#eef2f7',
  color: '#0f172a',
  padding: '40px 20px 60px',
};

const shellStyle: React.CSSProperties = {
  maxWidth: 980,
  margin: '0 auto',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.86)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(15,23,42,0.08)',
  borderRadius: 32,
  padding: 32,
  boxShadow: '0 20px 60px rgba(15,23,42,0.10)',
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 56,
  lineHeight: 1,
  letterSpacing: '-0.05em',
  color: '#0f172a',
};

const subheadingStyle: React.CSSProperties = {
  marginTop: 16,
  marginBottom: 0,
  fontSize: 19,
  lineHeight: 1.7,
  color: '#64748b',
  maxWidth: 760,
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: 18,
  marginTop: 32,
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  color: '#475569',
};

const inputStyle: React.CSSProperties = {
  height: 54,
  borderRadius: 16,
  border: '1px solid #dbe3ef',
  background: '#fff',
  padding: '0 16px',
  fontSize: 16,
  color: '#0f172a',
  outline: 'none',
};

const buttonStyle: React.CSSProperties = {
  height: 56,
  borderRadius: 18,
  border: 'none',
  background: '#0f172a',
  color: '#fff',
  fontWeight: 800,
  fontSize: 16,
  padding: '0 22px',
  cursor: 'pointer',
};

const resultCardStyle: React.CSSProperties = {
  marginTop: 28,
  padding: 28,
  borderRadius: 28,
  background: '#ffffff',
  border: '1px solid #dbe3ef',
};

const helperStyle: React.CSSProperties = {
  marginTop: 12,
  fontSize: 15,
  color: '#64748b',
};

function getRiskBadgeStyle(riskLevel?: string): React.CSSProperties {
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

export default function ScorePage() {
  const [personType, setPersonType] = useState<PersonType>('PF');
  const [documentValue, setDocumentValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const apiBaseUrl = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setErrorMessage('');

    try {
      const payload = {
        personType,
        document: documentValue.trim(),
        fullName: fullName.trim(),
      };

      const res = await fetch(`${apiBaseUrl}/scoring/person`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data: ScoreResponse | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const backendMessage =
          data?.message ||
          'A API de score respondeu com erro. Verifique se o backend está rodando e se a rota /scoring/person existe.';

        throw new Error(backendMessage);
      }

      setResult(data || {});
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Falha ao consultar score';
      console.error('Erro ao consultar score:', error);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <div style={cardStyle}>
          <h1 style={headingStyle}>Consulta de Score Jurídico</h1>

          <p style={subheadingStyle}>
            Consulte o score preliminar de confiança jurídica de uma pessoa física
            ou jurídica dentro da infraestrutura da IMOBAI.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={formGridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Tipo</label>
                <select
                  value={personType}
                  onChange={(e) => setPersonType(e.target.value as PersonType)}
                  style={inputStyle}
                >
                  <option value="PF">Pessoa Física</option>
                  <option value="PJ">Pessoa Jurídica</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>CPF / CNPJ</label>
                <input
                  value={documentValue}
                  onChange={(e) => setDocumentValue(e.target.value)}
                  placeholder={personType === 'PF' ? 'Digite o CPF' : 'Digite o CNPJ'}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>
                  {personType === 'PF' ? 'Nome completo' : 'Razão social'}
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    personType === 'PF'
                      ? 'Digite o nome completo'
                      : 'Digite a razão social'
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
              <button type="submit" disabled={loading} style={buttonStyle}>
                {loading ? 'Consultando...' : 'Consultar score'}
              </button>
            </div>

            <p style={helperStyle}>
              Endpoint usado: <strong>{apiBaseUrl}/scoring/person</strong>
            </p>
          </form>

          {errorMessage ? (
            <div
              style={{
                ...resultCardStyle,
                border: '1px solid #fecaca',
                background: '#fef2f2',
              }}
            >
              <h2 style={{ marginTop: 0, color: '#991b1b' }}>Erro ao consultar</h2>
              <p style={{ margin: 0, color: '#7f1d1d', lineHeight: 1.7 }}>
                {errorMessage}
              </p>
            </div>
          ) : null}

          {result ? (
            <div style={resultCardStyle}>
              <div style={{ marginBottom: 18 }}>
                <span style={getRiskBadgeStyle(result.riskLevel)}>
                  Risco {result.riskLevel || 'NÃO INFORMADO'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 72,
                    lineHeight: 0.9,
                    fontWeight: 900,
                    letterSpacing: '-0.05em',
                    color: '#0f172a',
                  }}
                >
                  {typeof result.score === 'number' ? result.score : '--'}
                </div>

                <div
                  style={{
                    fontSize: 24,
                    marginBottom: 10,
                    color: '#64748b',
                  }}
                >
                  / 100
                </div>
              </div>

              <p style={{ ...helperStyle, marginTop: 0 }}>
                Score calculado com base na resposta do backend da IMOBAI.
              </p>

              {result.message ? (
                <p style={{ ...helperStyle, color: '#334155' }}>
                  <strong>Mensagem:</strong> {result.message}
                </p>
              ) : null}

              {result.details ? (
                <pre
                  style={{
                    marginTop: 18,
                    padding: 16,
                    borderRadius: 18,
                    background: '#f8fafc',
                    border: '1px solid #dbe3ef',
                    overflowX: 'auto',
                    fontSize: 13,
                    color: '#334155',
                  }}
                >
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}