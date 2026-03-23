"use client"

import { useState } from "react"

type Props = {
  dealId: number
  buyerId: number
  sellerId: number
}

export default function OfferBox({ dealId, buyerId }: Props) {
  const [price, setPrice] = useState("")
  const [conditions, setConditions] = useState("")
  const [loading, setLoading] = useState(false)

  async function sendOffer() {
    setLoading(true)

    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dealId,
        userId: buyerId,
        price: Number(price),
        conditions
      })
    })

    setLoading(false)

    if (!res.ok) {
      alert("Erro ao enviar proposta")
      return
    }
 
alert("Proposta enviada");
window.location.reload();
setPrice("");
setConditions("");

  }

  return (
    <div style={{
      marginTop: 20,
      padding: 20,
      border: "1px solid #e5e5e5",
      borderRadius: 12
    }}>

      <h3>Enviar proposta</h3>

      <input
        placeholder="Valor da proposta"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
        style={{
          width:"100%",
          padding:10,
          marginTop:10
        }}
      />

      <textarea
        placeholder="Condições (ex: pagamento em 30 dias)"
        value={conditions}
        onChange={(e)=>setConditions(e.target.value)}
        style={{
          width:"100%",
          padding:10,
          marginTop:10
        }}
      />

      <button
        onClick={sendOffer}
        disabled={loading}
        style={{
          marginTop:12,
          padding:"10px 18px",
          background:"#111",
          color:"#fff",
          borderRadius:8
        }}
      >
        Enviar proposta
      </button>

    </div>
  )
}