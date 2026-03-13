
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoImovelPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/imoveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          address,
          image: image || null,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        alert("Erro ao salvar: " + t);
        return;
      }

      router.push("/admin/imoveis");
      router.refresh();
    } catch {
      alert("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
        <div>
          <h1 className="h1">Novo imóvel</h1>
          <div className="subtitle">Cadastre um novo imóvel para aparecer no admin/marketplace.</div>
        </div>

        <div className="actionsRow">
          <Link className="btn" href="/admin/imoveis">← Voltar</Link>
        </div>
      </div>

      <div className="card">
        <div className="cardBody">
          <form onSubmit={salvar} className="grid2">
            <div>
              <div className="label">Título</div>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <div className="label">Preço</div>
              <input
                className="input"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <div className="label">Descrição</div>
              <textarea
                className="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="label">Cidade</div>
              <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>

            <div>
              <div className="label">Imagem (nome do arquivo)</div>
              <input className="input" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button className="btn btnPrimary" type="submit" disabled={loading}>
                {loading ? "Salvando…" : "Criar imóvel"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}