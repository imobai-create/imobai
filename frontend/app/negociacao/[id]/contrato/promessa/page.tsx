


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

  return (
    <main style={{ padding: 40 }}>
      <Link href={`/negociacao/${dealId}`}>← Voltar</Link>

      <h1>Promessa de Compra e Venda</h1>

      <div style={{ marginTop: 12, color: "#475569", fontWeight: 600 }}>
        Status: {contract.status}
      </div>

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


