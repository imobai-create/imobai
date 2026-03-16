
import pool from "@/lib/db"
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDiligencias() {


  const res = await pool.query(`
    SELECT d.id, d.tipo, d.status, p.title
    FROM diligencias d
    JOIN property p ON p.id = d.property_id
    ORDER BY d.id DESC
  `)

  const rows = res.rows

  return (

    <main style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>

      <h1>Diligências</h1>

      {rows.map(d => (

        <div
          key={d.id}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginTop: 20,
            borderRadius: 10
          }}
        >

          <b>{d.title}</b>

          <div>Tipo: {d.tipo}</div>

          <div>Status: {d.status}</div>

          <div>{d.detalhes}</div>

        </div>

      ))}

    </main>

  )
}