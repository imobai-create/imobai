



"use client";

import { useRouter } from "next/navigation";

type Props = {
  tokenReference: string;
};

export default function ViewCertificateButton({ tokenReference }: Props) {
  const router = useRouter();

  function handleClick() {
    if (!tokenReference) {
      alert("Certificado indisponível.");
      return;
    }

    router.push(`/trust-token/${tokenReference}`);
  }

  return (
    <button
      onClick={handleClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 18px",
        borderRadius: 14,
        border: "1px solid #d6dae1",
        background: "#ffffff",
        color: "#0f172a",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Ver certificado
    </button>
  );
}


