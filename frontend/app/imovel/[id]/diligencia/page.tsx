import pool from "@/lib/db";
import Link from "next/link";

type PageProps = {
  params: { id: string };
};

export default async function DiligenciaPage({ params }: PageProps) {
  const propertyId = Number(params.id);

  if (!Number.isFinite(propertyId)) {
    return (
      <main className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-2xl font-semibold">ID inválido</h1>
        <Link href="/marketplace">Voltar</Link>
      </main>
    );
  }

  const res = await pool.query(
    `
    SELECT *
    FROM diligencias
    WHERE property_id = $1
    LIMIT 1
  `,
    [propertyId]
  );

  const diligencia = res.rows[0];

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <Link
        href={`/imovel/${propertyId}`}
        className="text-sm text-neutral-500"
      >
        ← Voltar para o imóvel
      </Link>

      <h1 className="text-3xl font-semibold mt-6">
        Diligência do imóvel
      </h1>

      <p className="text-neutral-600 mt-2">
        Análise jurídica e documental do imóvel.
      </p>

      <div className="mt-10 bg-white border rounded-2xl p-8 space-y-4">

        <StatusItem
          label="Identidade do proprietário"
          value={diligencia?.owner_verified}
        />

        <StatusItem
          label="Documento do imóvel enviado"
          value={diligencia?.document_uploaded}
        />

        <StatusItem
          label="Matrícula conferida"
          value={diligencia?.registry_checked}
        />

        <StatusItem
          label="Análise de processos judiciais"
          value={diligencia?.court_check}
        />

        <StatusItem
          label="Situação fiscal"
          value={diligencia?.tax_check}
        />

      </div>

      <div className="mt-10 p-6 rounded-xl bg-green-50 border border-green-200">
        <h2 className="font-semibold text-green-700">
          Status final
        </h2>

        <p className="text-green-700 mt-2">
          {diligencia?.approved
            ? "Imóvel apto para negociação."
            : "Análise em andamento."}
        </p>
      </div>
    </main>
  );
}

function StatusItem({
  label,
  value,
}: {
  label: string;
  value?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <span className="text-neutral-700">{label}</span>

      <span
        className={`text-sm font-medium ${
          value
            ? "text-green-600"
            : "text-yellow-600"
        }`}
      >
        {value ? "Verificado" : "Pendente"}
      </span>
    </div>
  );
}



