
import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const propertyId = Number(id);
  if (!Number.isFinite(propertyId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const propertyRes = await pool.query(
      `SELECT
        id, title, description, price, address, "userId", image, "createdAt", "updatedAt", status_diligencia
      FROM property
      WHERE id = $1
      LIMIT 1`,
      [propertyId]
    );

    if (propertyRes.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const imagesRes = await pool.query(
      `SELECT id, url, "createdAt"
       FROM property_image
       WHERE "propertyId" = $1
       ORDER BY id ASC`,
      [propertyId]
    );

    const videosRes = await pool.query(
      `SELECT id, url, "createdAt"
       FROM property_video
       WHERE "propertyId" = $1
       ORDER BY id ASC`,
      [propertyId]
    );

    return NextResponse.json({
      property: propertyRes.rows[0],
      images: imagesRes.rows,
      videos: videosRes.rows,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}