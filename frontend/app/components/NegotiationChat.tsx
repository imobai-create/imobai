


"use client";

import { useEffect, useState } from "react";

type MessageRow = {
  id: number;
  sender: string;
  message: string;
  created_at: string;
};

type Props = {
  dealId: number;
  buyerId: number;
  sellerId: number;
};

export default function NegotiationChat({ dealId, buyerId }: Props) {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState("");

  async function loadMessages() {
    try {
      setLoadingMessages(true);
      setError("");

      const res = await fetch(`/api/chat?dealId=${dealId}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Erro ao carregar mensagens.");
        return;
      }

      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setError("Erro ao carregar mensagens.");
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [dealId]);

  async function sendMessage() {
    const clean = text.trim();
    if (!clean) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealId,
          message: clean,
          sender: "Comprador",
          senderId: buyerId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.details || data?.error || "Erro ao enviar mensagem.");
        return;
      }

      setText("");
      await loadMessages();
    } catch {
      setError("Erro ao enviar mensagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 18 }}>
      {loadingMessages ? (
        <div style={boxMuted}>Carregando mensagens...</div>
      ) : messages.length === 0 ? (
        <div style={boxMuted}>Nenhuma mensagem ainda.</div>
      ) : (
        <div style={messagesBox}>
          {messages.map((msg) => (
            <div key={msg.id} style={msgCard}>
              <div style={msgTop}>
                <strong>{msg.sender || "Participante"}</strong>
                <span style={{ color: "#64748b", fontSize: 13 }}>
                  {new Date(msg.created_at).toLocaleString("pt-BR")}
                </span>
              </div>

              <div style={{ marginTop: 8, color: "#0f172a", lineHeight: 1.5 }}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}

      {error ? <div style={errorBox}>{error}</div> : null}

      <div style={sendRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite uma mensagem..."
          style={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={loading}
          style={{
            ...sendButton,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}

const boxMuted: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 18,
  padding: 18,
  color: "#64748b",
  fontSize: 18,
};

const messagesBox: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const msgCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 18,
  padding: 16,
};

const msgTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  color: "#0f172a",
};

const errorBox: React.CSSProperties = {
  marginTop: 14,
  background: "#fef2f2",
  color: "#b91c1c",
  border: "1px solid rgba(185,28,28,0.15)",
  borderRadius: 14,
  padding: 12,
  fontWeight: 600,
};

const sendRow: React.CSSProperties = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "1fr 140px",
  gap: 12,
};

const input: React.CSSProperties = {
  width: "100%",
  minHeight: 56,
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.12)",
  background: "#fff",
  padding: "0 16px",
  fontSize: 16,
  outline: "none",
};

const sendButton: React.CSSProperties = {
  minHeight: 56,
  borderRadius: 16,
  border: "1px solid rgba(15,23,42,0.08)",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 700,
  fontSize: 16,
};

