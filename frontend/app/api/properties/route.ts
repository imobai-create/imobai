import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const res = await pool.query(
      `SELECT
        id, title, description, price, address, image, status_diligencia
      FROM property
      ORDER BY id DESC
      LIMIT 50`
    );

    return NextResponse.json({ items: res.rows });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}