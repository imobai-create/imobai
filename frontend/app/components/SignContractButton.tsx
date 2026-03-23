
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  contractId: number;
  label?: string;
};

export default function SignContractButton({
  contractId,
  label = "Assinar promessa",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSign() {
    try {
      setLoading(true);

      const res = await fetch("/api/contract/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contractId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Erro ao assinar: ${data.detail || data.error || "desconhecido"}`);
        return;
      }

      alert("Contrato assinado com sucesso");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao assinar contrato");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSign}
      disabled={loading}
      style={{
        marginTop: 20,
        minHeight: 48,
        padding: "0 18px",
        borderRadius: 12,
        border: "none",
        background: "#111827",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {loading ? "Assinando..." : label}
    </button>
  );
}
