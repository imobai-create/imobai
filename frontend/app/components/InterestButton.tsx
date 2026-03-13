"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InterestButton({
  propertyId,
  ownerId,
  price,
}: {
  propertyId: number;
  ownerId: number;
  price: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      const buyerId = 1;

      const res = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          buyerId,
          sellerId: ownerId,
          price,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        alert("Erro ao abrir negociação: " + t);
        return;
      }

      const data = await res.json();
      router.push(`/negociacao/${data.dealId}`);
    } catch (error) {
      alert("Erro ao abrir negociação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      style={{
        width: "100%",
        height: 52,
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#0f172a",
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Abrindo..." : "Falar com o proprietário"}
    </button>
  );
}