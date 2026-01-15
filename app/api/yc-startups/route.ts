import { NextResponse } from "next/server";
import { listYcStartups } from "@/mongodb/ycStartups";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("q");
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "24");

  const result = await listYcStartups({
    search,
    page: Number.isFinite(page) ? page : 1,
    limit: Number.isFinite(limit) ? limit : 24,
  });

  return NextResponse.json(result);
}
