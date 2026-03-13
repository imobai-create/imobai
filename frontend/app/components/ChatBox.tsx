"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatBox({ dealId }: { dealId: number }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function sendMessage() {
    const message = text.trim();
    if (!message || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealId,
          senderName: "Comprador",
          message,
        }),
      });

      if (!res.ok) {
        const t = await res.text();
        alert("Erro ao enviar mensagem: " + t);
        return;
      }

      setText("");
      router.refresh();
    } catch (error) {
      alert("Erro ao enviar mensagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite uma mensagem..."
          style={{
            flex: 1,
            height: 48,
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.12)",
            padding: "0 14px",
            background: "rgba(255,255,255,0.92)",
          }}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={loading}
          style={{
            height: 48,
            minWidth: 120,
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "#0f172a",
            color: "#fff",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}