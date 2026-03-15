

import { NextResponse } from "next/server";
import pool from "@/lib/db";

type Ctx = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const propertyId = Number(id);

  if (!Number.isFinite(propertyId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const propertyRes = await pool.query(
      `
      SELECT *
      FROM property
      WHERE id = $1
      LIMIT 1
      `,
      [propertyId]
    );

    if (propertyRes.rows.length === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const imagesRes = await pool.query(
      `
      SELECT *
      FROM property_image
      WHERE property_id = $1
      ORDER BY id ASC
      `,
      [propertyId]
    );

    const videosRes = await pool.query(
      `
      SELECT *
      FROM property_video
      WHERE property_id = $1
      ORDER BY id ASC
      `,
      [propertyId]
    );

    return NextResponse.json({
      property: propertyRes.rows[0],
      images: imagesRes.rows,
      videos: videosRes.rows,
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

