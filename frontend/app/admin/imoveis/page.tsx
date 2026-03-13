
"use client";

import { useEffect, useState } from "react";

type Imovel = {
  id: number;
  title: string;
  price: number;
  address: string;
};

export default function AdminImoveisPage() {

  const [items, setItems] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const res = await fetch("/api/imoveis", {
        cache: "no-store",
      });

      const data = await res.json();

      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="max-w-5xl mx-auto py-16 px-6">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold">Admin • Imóveis</h1>

        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-black text-white"
        >
          Recarregar
        </button>
      </div>

      {loading && (
        <p>Carregando...</p>
      )}

      {!loading && items.length === 0 && (
        <p>Nenhum imóvel cadastrado.</p>
      )}

      <div className="space-y-4">

        {items.map((imovel) => (

          <div
            key={imovel.id}
            className="border rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold">
              {imovel.title}
            </h2>

            <p className="text-neutral-600">
              {imovel.address}
            </p>

            <p className="mt-2 font-medium">
              R$ {Number(imovel.price).toLocaleString("pt-BR")}
            </p>

          </div>

        ))}

      </div>

    </main>
  );
}

