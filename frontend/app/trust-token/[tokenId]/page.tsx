
import pool from "@/lib/db";

type PageProps = {
  params: { tokenId: string };
};

export default async function TrustTokenPage({ params }: PageProps) {
  const { tokenId } = params;

  // 1. buscar trust token
  const tokenRes = await pool.query(
    `
    SELECT *
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

  // 2. buscar deal
  const dealRes = await pool.query(
    `
    SELECT
      id,
      property_id,
      buyer_user_id,
      seller_user_id,
      price,
      status
    FROM deal
    WHERE id = $1
    LIMIT 1
  `,
    [token.deal_id]
  );

  const deal = dealRes.rows[0];

  // 3. buscar imóvel
  const propertyRes = await pool.query(
    `
    SELECT
      id,
      title,
      address,
      image,
      score,
      risk_level
    FROM property
    WHERE id = $1
    LIMIT 1
  `,
    [deal.property_id]
  );

  const property = propertyRes.rows[0];

  return (
    <main style={{ padding: 40 }}>
      <h1>Trust Token Público</h1>

      <div style={{ marginTop: 20 }}>
        <strong>Token:</strong> {token.token_reference}
      </div>

      <div>
        <strong>Status:</strong> {token.status}
      </div>

      <div>
        <strong>Score:</strong> {property.score}
      </div>

      <div>
        <strong>Risco:</strong> {property.risk_level}
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h2>{property.title}</h2>
      <p>{property.address}</p>

      <img
        src={property.image}
        style={{ width: "100%", maxWidth: 500, borderRadius: 12 }}
      />

      <h3 style={{ marginTop: 20 }}>
        R$ {Number(deal.price).toLocaleString("pt-BR")}
      </h3>
    </main>
  );
}



