
import pool from "@/lib/db";

type Props = {
  params: { tokenId: string };
};

export default async function TrustTokenPage({ params }: Props) {
  const tokenId = params.tokenId;

  const tokenRes = await pool.query(
    `
    SELECT
      id,
      deal_id,
      property_id,
      token_reference,
      trust_score,
      risk_level,
      status
    FROM trust_token
    WHERE token_reference = $1
    LIMIT 1
  `,
    [tokenId]
  );

  if (tokenRes.rows.length === 0) {
    return <div>Token não encontrado</div>;
  }

  const token = tokenRes.rows[0];

  const propertyRes = await pool.query(
    `
    SELECT id, title, address, price
    FROM property
    WHERE id = $1
    LIMIT 1
  `,
    [token.property_id]
  );

  const property = propertyRes.rows[0];

  return (
    <div style={{ padding: 40 }}>
      <h1>Trust Token Público</h1>

      <p><strong>Token:</strong> {token.token_reference}</p>
      <p><strong>Status:</strong> {token.status}</p>
      <p><strong>Score:</strong> {token.trust_score}</p>
      <p><strong>Risco:</strong> {token.risk_level}</p>

      <hr />

      <h2>Imóvel</h2>
      <p><strong>Título:</strong> {property?.title}</p>
      <p><strong>Endereço:</strong> {property?.address}</p>
      <p><strong>Preço:</strong> R$ {property?.price}</p>
    </div>
  );
}

