import { NextResponse } from "next/server";
import { getYcStartupBySlug } from "@/mongodb/ycStartups";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const doc = await getYcStartupBySlug(slug);

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(doc);
}
