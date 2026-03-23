







import pool from "@/lib/db";
import Link from "next/link";
import SignContractButton from "@/app/components/SignContractButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PromessaPage({ params }: PageProps) {
  const { id } = await params;
  const dealId = Number(id);

  const res = await pool.query<{
    id: number;
    content: string;
    status: string;
  }>(
    `
    SELECT id, content, status
    FROM contract
    WHERE deal_id = $1
      AND type = 'PROMESSA_COMPRA_VENDA'
    ORDER BY id DESC
    LIMIT 1
    `,
    [dealId]
  );

  const contract = res.rows[0];

  if (!contract) {
    return (
      <main style={{ padding: 40 }}>
        <Link href={`/negociacao/${dealId}`}>← Voltar</Link>
        <h1>Promessa não encontrada</h1>
      </main>
    );
  }

  const eventsRes = await pool.query<{
    event_type: string;
    payload: string;
    created_at: string;
  }>(
    `
    SELECT event_type, payload, created_at
    FROM contract_event
    WHERE contract_id = $1
    ORDER BY id DESC
    `,
    [contract.id]
  );

  const signEvent = eventsRes.rows.find((e) => e.event_type === "SIGNED");

  return (
    <main style={{ padding: 40 }}>
      <Link href={`/negociacao/${dealId}`}>← Voltar</Link>

      <h1>Promessa de Compra e Venda</h1>

      <div style={{ marginTop: 12, color: "#475569", fontWeight: 600 }}>
        Status: {contract.status}
      </div>

      {signEvent && (
        <div style={{ marginTop: 12, color: "#334155" }}>
          Assinado em: {new Date(signEvent.created_at).toLocaleString("pt-BR")}
          <br />
          {signEvent.payload}
        </div>
      )}

      {contract.status !== "SIGNED" ? (
        <SignContractButton contractId={contract.id} />
      ) : (
        <div
          style={{
            marginTop: 20,
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: 12,
            background: "rgba(16,185,129,0.12)",
            color: "#065f46",
            fontWeight: 700,
          }}
        >
          Promessa assinada
        </div>
      )}

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
        {contract.content}
      </pre>
    </main>
  );
}