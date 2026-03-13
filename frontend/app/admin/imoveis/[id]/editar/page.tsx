"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarImovelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");

  // Carrega dados do imóvel
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/imoveis/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          alert("Imóvel não encontrado");
          router.push("/admin/imoveis");
          return;
        }

        const data = await res.json();

        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setPrice(String(data.price ?? ""));
        setAddress(data.address ?? "");
        setImage(data.image ?? "");
      } catch (err) {
        alert("Erro ao carregar imóvel");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id, router]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/imoveis/${id}`, {
        method: "PUT",
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
        alert("Erro ao atualizar: " + t);
        return;
      }

      router.push("/admin/imoveis");
      router.refresh();
    } catch (err) {
      alert("Erro inesperado");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="subtle">Carregando imóvel...</div>
    );
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">Editar imóvel</h1>
          <div className="subtle">ID: {id}</div>
        </div>

        <Link className="btn" href="/admin/imoveis">
          ← Voltar
        </Link>
      </div>

      <div className="card">
        <div className="cardBody">
          <form onSubmit={salvar} style={{ display: "grid", gap: 18, maxWidth: 600 }}>

            <div>
              <div className="subtle">Título</div>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="subtle">Descrição</div>
              <textarea
                className="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="subtle">Preço</div>
              <input
                className="input"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="subtle">Cidade</div>
              <input
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="subtle">Imagem</div>
              <input
                className="input"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btnPrimary"
              disabled={saving}
              style={{ width: "fit-content" }}
            >
              {saving ? "Salvando..." : "Atualizar imóvel"}
            </button>

          </form>
        </div>
      </div>
    </>
  );
}