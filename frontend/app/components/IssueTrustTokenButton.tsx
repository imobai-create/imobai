'use client';

import { useState } from 'react';

type Props = {
  dealId: number;
};

export default function IssueTrustTokenButton({ dealId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleIssue() {
    try {
      setLoading(true);

      const res = await fetch(`/api/trust-token/${dealId}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Erro ao emitir Trust Token');
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Erro ao emitir Trust Token');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleIssue}
      disabled={loading}
      style={{
        height: 52,
        padding: '0 20px',
        borderRadius: 16,
        border: 'none',
        background: '#0f172a',
        color: '#fff',
        fontWeight: 700,
        fontSize: 15,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? 'Emitindo Trust Token...' : 'Emitir Trust Token'}
    </button>
  );
}