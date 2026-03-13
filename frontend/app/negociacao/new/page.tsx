
import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ propertyId?: string }> };

export default async function NewNegociacaoPage(props: Props) {
  const sp = await props.searchParams;
  const propertyId = Number(sp.propertyId);

  if (!Number.isFinite(propertyId)) {
    redirect("/marketplace");
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${base}/api/deals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ propertyId, buyerUserId: 1 }),
  });

  if (!res.ok) {
    redirect(`/imovel/${propertyId}`);
  }

  const data = await res.json();
  redirect(`/negociacao/${data.dealId}`);
}