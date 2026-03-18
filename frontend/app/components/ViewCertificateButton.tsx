



"use client";

import { useRouter } from "next/navigation";

type Props = {
  tokenReference: string | null;
};

export default function ViewCertificateButton({ tokenReference }: Props) {
  const router = useRouter();

  function handleClick() {
    if (!tokenReference) {
      alert("Token não disponível");
      return;
    }

 router.push(`/trust-token/${tokenReference}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 52,
        padding: "0 18px",
        borderRadius: 16,
        background: "#ffffff",
        color: "#111827",
        border: "1px solid rgba(15,23,42,0.10)",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Ver certificado
    </button>
  );
}