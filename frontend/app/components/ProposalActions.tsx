

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Proposal = {
  id: number;
  deal_id: number;
  user_id: number;
  price: number | string;
  conditions: string | null;
  status: string;
  created_at: string;
};

type Props = {
  proposal: Proposal | null;
};

function formatPrice(value: number | string) {
  const num = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(num)) return "Preço não informado";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(num);
}

export default function ProposalActions({ proposal }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function acceptProposal() {
    if (!proposal) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/proposals/${proposal.id}/accept`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Erro ao aceitar proposta: ${data.detail || data.error || "desconhecido"}`);
        return;
      }

      alert("Proposta aceita");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao aceitar proposta");
    } finally {
      setLoading(false);
    }
  }

  async function rejectProposal() {
    if (!proposal) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/proposals/${proposal.id}/reject`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Erro ao rejeitar proposta: ${data.detail || data.error || "desconhecido"}`);
        return;
      }

      alert("Proposta rejeitada");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao rejeitar proposta");
    } finally {
      setLoading(false);
    }
  }

  if (!proposal) {
    return (
      <div
        style={{
          marginTop: 22,
          padding: 18,
          borderRadius: 18,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800 }}>Proposta atual</div>
        <div style={{ marginTop: 8, color: "#64748b" }}>
          Nenhuma proposta formal enviada ainda.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 22,
        padding: 18,
        borderRadius: 18,
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 800 }}>Proposta atual</div>

      <div style={{ marginTop: 12, color: "#475569", lineHeight: 1.6 }}>
        <div>
          <strong>Valor:</strong> {formatPrice(proposal.price)}
        </div>
        <div style={{ marginTop: 6 }}>
          <strong>Condições:</strong> {proposal.conditions || "Não informadas"}
        </div>
        <div style={{ marginTop: 6 }}>
          <strong>Status:</strong> {proposal.status}
        </div>
        <div style={{ marginTop: 6 }}>
          <strong>Criada em:</strong>{" "}
          {new Date(proposal.created_at).toLocaleString("pt-BR")}
        </div>
      </div>

      {proposal.status === "PENDING" && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          <button
            type="button"
            onClick={acceptProposal}
            disabled={loading}
            style={{
              minHeight: 48,
              padding: "0 16px",
              borderRadius: 12,
              border: "none",
              background: "#111827",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Aceitar proposta
          </button>

          <button
            type="button"
            onClick={rejectProposal}
            disabled={loading}
            style={{
              minHeight: 48,
              padding: "0 16px",
              borderRadius: 12,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#fff",
              color: "#111827",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Rejeitar proposta
          </button>
        </div>
      )}
    </div>
  );
}


