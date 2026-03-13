
"use client";

import { useEffect, useState } from "react";

type TrustToken = {
  token_reference: string;
  trust_score: number;
  risk_level: string;
  network: string;
};

export default function TrustPanel({ propertyId }: { propertyId: number }) {
  const [token, setToken] = useState<TrustToken | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/trust-token/${propertyId}`);
        if (!res.ok) return;

        const data = await res.json();
        setToken(data);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [propertyId]);

  if (!token) return null;

  return (
    <div
      style={{
        marginTop: 30,
        padding: 24,
        borderRadius: 14,
        background: "#ffffff",
        border: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0" }}>Trust Protocol • IMOB.AI</h3>

      <div style={{ fontSize: 14, lineHeight: "22px" }}>
        <div>
          Trust Token: <b>{token.token_reference}</b>
        </div>
        <div>
          Score Jurídico: <b>{token.trust_score}</b>
        </div>
        <div>
          Risco: <b>{token.risk_level}</b>
        </div>
        <div>
          Blockchain: <b>{token.network}</b>
        </div>
      </div>
    </div>
  );
}






















