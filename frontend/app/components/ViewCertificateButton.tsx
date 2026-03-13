
"use client"

import { useRouter } from "next/navigation"

export default function ViewCertificateButton({
  tokenReference
}: {
  tokenReference?: string
}) {

  const router = useRouter()

  if (!tokenReference) return null

  return (
    <button
      onClick={() => router.push(`/trust-token/${tokenReference}`)}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "#fff",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600
      }}
    >
      Ver certificado
    </button>
  )
}


