

"use client";

import { useEffect, useState } from "react";

export default function ChatBox({ dealId }: { dealId: number }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  async function load() {
    const res = await fetch(`/api/chat?dealId=${dealId}`);
    const data = await res.json();
    setMessages(data);
  }

  async function send() {
    if (!text.trim()) return;

    await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dealId,
        senderUserId: 1,
        message: text
      })
    });

    setText("");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mt-8 border rounded-xl p-5">

      <div className="h-64 overflow-auto border rounded p-3">
        {messages.map(m => (
          <div key={m.id} className="mb-2">
            <b>usuário {m.sender_user_id}</b>
            <div>{m.message}</div>
          </div>
        ))}
      </div>

      <div className="flex mt-3 gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={send}
          className="bg-black text-white px-4 rounded"
        >
          Enviar
        </button>
      </div>

    </div>
  );
}





