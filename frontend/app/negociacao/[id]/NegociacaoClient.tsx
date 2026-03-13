
"use client";

import { useEffect, useState } from "react";

type ChatMsg = {
  id: number;
  deal_id: number;
  sender_user_id: number;
  message: string;
  created_at: string;
};

export default function NegociacaoClient({
  propertyId,
  dealId,
  dealPrice,
}: {
  propertyId: number;
  dealId: number;
  dealPrice: number;
}) {
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [info, setInfo] = useState("");

  // MVP: sem login ainda → vamos usar userId=0
  // Depois quando tiver login, troca pelo id do usuário logado.
  const senderUserId = 0;

  async function loadStatus() {
    const r = await fetch(`/api/deal/status?dealId=${dealId}`, {
      cache: "no-store",
    });
    const data = await r.json();
    setSigned(Boolean(data?.signed));
  }

  async function loadChat() {
    const r = await fetch(`/api/chat/list?dealId=${dealId}`, {
      cache: "no-store",
    });
    const data = await r.json();
    setMsgs(Array.isArray(data?.messages) ? data.messages : []);
  }

  useEffect(() => {
    loadStatus();
    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signContract() {
    setLoading(true);
    setInfo("");
    try {
      const r = await fetch("/api/deal/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erro ao assinar");
      setSigned(true);
      setInfo("Contrato de indicação assinado. Chat liberado.");
    } catch (e: any) {
      setInfo(e.message || "Erro");
    } finally {
      setLoading(false);
    }
  }

  async function createEscrowPlaceholder() {
    setLoading(true);
    setInfo("");
    try {
      const r = await fetch("/api/escrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId,
          propertyId,
          amount: dealPrice,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erro ao criar escrow");
      setInfo(
        data?.reused
          ? `Escrow já estava preparado. TxId: ${data.transactionId}`
          : `Escrow preparado (registro criado). TxId: ${data.transactionId}`
      );
    } catch (e: any) {
      setInfo(e.message || "Erro");
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    if (!text.trim()) return;
    setLoading(true);
    setInfo("");
    try {
      const r = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId,
          message: text.trim(),
          senderUserId,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erro ao enviar");
      setText("");
      await loadChat();
    } catch (e: any) {
      setInfo(e.message || "Erro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-neutral-200 rounded-lg p-6 bg-white">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-sm text-neutral-500">Negociação (deal)</div>
          <div className="text-lg font-semibold mt-1">Deal #{dealId}</div>

          <div className="text-sm text-neutral-600 mt-2">
            <b>Modelo B:</b> taxa 1% paga <b>no fechamento</b> • <b>quem paga:</b>{" "}
            vendedor • <b>sem cobrança antecipada</b>.
          </div>

          <div className="text-xs text-neutral-500 mt-2">
            Contatos ficam ocultos até assinatura do contrato de indicação.
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-neutral-500">Valor (referência)</div>
          <div className="text-xl font-semibold">
            {Number(dealPrice || 0).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {!signed ? (
          <button
            disabled={loading}
            onClick={signContract}
            className="bg-black text-white px-5 py-3 rounded-md font-medium hover:bg-neutral-800 transition disabled:opacity-60"
          >
            Assinar contrato de indicação
          </button>
        ) : (
          <div className="px-4 py-3 rounded-md bg-neutral-50 border border-neutral-200 text-sm">
            Contrato assinado ✅ (chat liberado)
          </div>
        )}

        <button
          disabled={loading}
          onClick={createEscrowPlaceholder}
          className="border border-neutral-300 bg-white text-neutral-900 px-5 py-3 rounded-md font-medium hover:bg-neutral-50 transition disabled:opacity-60"
        >
          Preparar escrow (sem cobrar agora)
        </button>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-6">
        <h3 className="font-semibold">Chat comprador ↔ vendedor (sem contatos)</h3>

        {!signed ? (
          <p className="text-sm text-neutral-600 mt-2">
            Chat bloqueado até assinatura do contrato de indicação.
          </p>
        ) : (
          <>
            <div className="mt-4 border border-neutral-200 rounded-md p-3 h-56 overflow-auto bg-white">
              {msgs.length === 0 ? (
                <div className="text-sm text-neutral-500">
                  Nenhuma mensagem ainda.
                </div>
              ) : (
                <div className="space-y-2">
                  {msgs.map((m) => (
                    <div key={m.id} className="text-sm">
                      <div className="text-neutral-800">{m.message}</div>
                      <div className="text-xs text-neutral-400">
                        user #{m.sender_user_id} • {m.created_at}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 border border-neutral-300 rounded-md px-3 py-2 text-sm"
                placeholder="Digite uma mensagem..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                disabled={loading}
                onClick={send}
                className="bg-neutral-900 text-white px-4 py-2 rounded-md text-sm disabled:opacity-60"
              >
                Enviar
              </button>
            </div>
          </>
        )}
      </div>

      {info && <div className="mt-4 text-sm text-neutral-700">{info}</div>}
    </div>
  );
}
