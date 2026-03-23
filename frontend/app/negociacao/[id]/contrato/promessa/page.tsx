

import pool from "@/lib/db";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PromessaPage({ params }: PageProps) {
  const { id } = await params;
  const dealId = Number(id);

  const res = await pool.query(
    `
    SELECT *
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

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
        {contract.content}
      </pre>
    </main>
  );
}




