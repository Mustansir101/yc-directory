import { connectToMongo } from "@/mongodb/connection";
import { YcStartupModel } from "@/mongodb/models/YcStartup";

export type YcStartupListItem = {
  ycId: number;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  oneLiner: string | null;
  batch: string | null;
  industries: string[];
  regions: string[];
  isHiring: boolean;
  teamSize: number | null;
  status: string | null;
};

export async function listYcStartups(options?: {
  search?: string | null;
  page?: number;
  limit?: number;
}) {
  await connectToMongo();

  const search = options?.search?.trim() || null;
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.min(60, Math.max(1, options?.limit ?? 24));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { name: rx },
      { slug: rx },
      { oneLiner: rx },
      { batch: rx },
      { industries: rx },
      { regions: rx },
      { status: rx },
    ];
  }

  const [items, total] = await Promise.all([
    YcStartupModel.find(filter)
      .sort({ ycId: 1 })
      .skip(skip)
      .limit(limit)
      .select({
        _id: 0,
        ycId: 1,
        name: 1,
        slug: 1,
        logo: 1,
        website: 1,
        oneLiner: 1,
        batch: 1,
        industries: 1,
        regions: 1,
        isHiring: 1,
        teamSize: 1,
        status: 1,
      })
      .lean<YcStartupListItem[]>(),
    YcStartupModel.countDocuments(filter),
  ]);

  return {
    items,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getYcStartupBySlug(slug: string) {
  await connectToMongo();

  const clean = slug.trim();
  if (!clean) return null;

  const doc = await YcStartupModel.findOne({ slug: clean })
    .select({ _id: 0, __v: 0 })
    .lean();

  return doc;
}
