"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TokenMode = "NONE" | "FULL" | "PARTIAL";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

function formatBRLFromDigits(digits: string) {
  // digits = "8500000" -> "85.000,00" (centavos)
  if (!digits) return "";
  const n = Number(digits);
  const cents = n % 100;
  const int = Math.floor(n / 100);

  const intStr = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const centsStr = cents.toString().padStart(2, "0");
  return `${intStr},${centsStr}`;
}

function brlToNumber(v: string) {
  // "8.500.000,00" -> 8500000
  const cleaned = v.replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function VenderImovelPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState("");

  // preço com máscara BR
  const [priceDigits, setPriceDigits] = useState(""); // em centavos
  const priceMasked = useMemo(() => formatBRLFromDigits(priceDigits), [priceDigits]);

  // tokenização (MVP)
  const [tokenMode, setTokenMode] = useState<TokenMode>("NONE");
  const [tokenPercent, setTokenPercent] = useState("50"); // só usado no PARTIAL

  const [loading, setLoading] = useState(false);

  const tokenizationEnabled = tokenMode !== "NONE";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const price = brlToNumber(priceMasked); // em reais

      const body: any = {
        title,
        description,
        price,
        address: city, // você está usando "address" como cidade no backend/front; mantendo compatível
        image: image || null,

        // MVP: campos extras (se o backend ignorar, ok; se aceitar, melhor)
        tokenizationEnabled,
        tokenizationMode: tokenMode,
        tokenizationPercent: tokenMode === "PARTIAL" ? Number(tokenPercent) : tokenMode === "FULL" ? 100 : 0,
      };

      const res = await fetch("/api/imoveis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const t = await res.text();
        alert("Erro ao enviar cadastro: " + t);
        return;
      }

      // sucesso: manda pra confirmação simples (por enquanto volta pra home)
      router.push("/?cadastro=ok");
      router.refresh();
    } catch (err) {
      alert("Erro inesperado ao enviar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">Vender imóvel</h1>
          <div className="subtle">
            Cadastre seu imóvel para análise. Após aprovação, ele aparece no marketplace.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn" href="/">
            ← Voltar
          </Link>
          <Link className="btn" href="/marketplace">
            Ver marketplace
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="cardBody">
          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 280px" }}>
              <div>
                <div className="subtle">Título</div>
                <input
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Casa moderna com vista"
                  required
                />
              </div>

              <div>
                <div className="subtle">Preço (R$)</div>
                <input
                  className="input"
                  inputMode="numeric"
                  value={priceMasked}
                  onChange={(e) => setPriceDigits(onlyDigits(e.target.value))}
                  placeholder="Ex.: 850.000,00"
                  required
                />
              </div>
            </div>

            <div>
              <div className="subtle">Descrição</div>
              <textarea
                className="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhes do imóvel, diferenciais, documentação, etc."
                required
              />
            </div>

            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <div className="subtle">Cidade</div>
                <input
                  className="input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex.: Nova Lima/MG"
                  required
                />
              </div>

              <div>
                <div className="subtle">Imagem (nome do arquivo)</div>
                <input
                  className="input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Ex.: IMG_6407.jpeg"
                />
              </div>
            </div>

            {/* Tokenização (MVP de UI) */}
            <div className="card" style={{ marginTop: 6 }}>
              <div className="cardBody" style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Tokenizar (ImobTokens)</div>
                    <div className="subtle">
                      MVP: você escolhe se quer tokenizar total ou parcialmente. A emissão on-chain vem depois.
                    </div>
                  </div>

                  <select
                    className="input"
                    style={{ width: 220 }}
                    value={tokenMode}
                    onChange={(e) => setTokenMode(e.target.value as TokenMode)}
                  >
                    <option value="NONE">Não tokenizar</option>
                    <option value="FULL">Tokenizar 100%</option>
                    <option value="PARTIAL">Tokenizar parcial</option>
                  </select>
                </div>

                {tokenMode === "PARTIAL" && (
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "220px 1fr" }}>
                    <div>
                      <div className="subtle">% do imóvel</div>
                      <input
                        className="input"
                        inputMode="numeric"
                        value={tokenPercent}
                        onChange={(e) => setTokenPercent(onlyDigits(e.target.value).slice(0, 3))}
                        placeholder="Ex.: 30"
                        required
                      />
                    </div>
                    <div className="subtle" style={{ alignSelf: "end" }}>
                      * Depois a gente define o modelo jurídico (direito econômico x veículo).
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
              <button type="submit" className="btn btnPrimary" disabled={loading} style={{ width: "fit-content" }}>
                {loading ? "Enviando..." : "Enviar para análise"}
              </button>
            </div>

            <div className="subtle" style={{ marginTop: 6 }}>
              Ao enviar, seu cadastro entra como <b>PENDENTE</b> para revisão e publicação.
            </div>
          </form>
        </div>
      </div>
    </>
  );
}