
'use client'

import { useEffect, useState } from 'react'

type Props = {
  dealId: number
}

export default function TrustTokenCard({ dealId }: Props) {
  const [token, setToken] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/trust-token/get/${dealId}`)
      .then((res) => res.json())
      .then((data) => {
        setToken(data)
      })
  }, [dealId])

  if (!token) return null

  return (
    <div
      style={{
        marginTop: 30,
        padding: 20,
        border: '1px solid #ddd',
        borderRadius: 10,
        background: '#fafafa'
      }}
    >
      <h3>Trust Token</h3>

      <p>
        <b>Token:</b> {token.token_reference}
      </p>

      <p>
        <b>Blockchain:</b> {token.network}
      </p>

      <p>
        <b>Trust Score:</b> {token.trust_score}
      </p>

      <p>
        <b>Risk Level:</b> {token.risk_level}
      </p>

      <p>
        <b>Status:</b> {token.status}
      </p>

      <p>
        <b>Hash:</b> {token.contract_hash}
      </p>
    </div>
  )
}

