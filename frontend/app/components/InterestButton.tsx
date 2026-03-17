"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  propertyId: number;
  ownerId: number;
  price: number;
};

export default function InterestButton({
  propertyId,
  ownerId,
  price,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      const res = await fetch("/api/deals/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          buyerId: 1,
          sellerId: ownerId,
          price,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.dealId) {
        alert(`Erro ao abrir negociação: ${JSON.stringify(data)}`);
        return;
      }

      router.push(`/negociacao/${data.dealId}`);
    } catch (error) {
      alert("Erro ao abrir negociação");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Abrindo..." : "Falar com o proprietário"}
    </button>
  );
}