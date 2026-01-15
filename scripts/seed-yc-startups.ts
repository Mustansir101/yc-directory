import dotenv from "dotenv";
import { connectToMongo } from "../mongodb/connection";
import { YcStartupModel } from "../mongodb/models/YcStartup";

const YC_ALL_COMPANIES_URL = "https://yc-oss.github.io/api/companies/all.json";

type YcApiCompany = {
  id: number;
  name: string;
  slug: string;
  small_logo_thumb_url?: string | null;
  website?: string | null;
  one_liner?: string | null;
  long_description?: string | null;
  batch?: string | null;
  industries?: string[] | null;
  regions?: string[] | null;
  isHiring?: boolean | null;
  team_size?: number | null;
  status?: string | null;
  industry?: string | null;
};

function normalizeCompany(c: YcApiCompany) {
  const rawLogo = (c.small_logo_thumb_url || "").trim();
  const logo =
    !rawLogo || rawLogo.includes("missing.png")
      ? null
      : rawLogo.startsWith("/")
        ? `https://www.ycombinator.com${rawLogo}`
        : rawLogo;

  const industries = Array.isArray(c.industries)
    ? c.industries.filter(Boolean)
    : c.industry
      ? [c.industry]
      : [];

  return {
    ycId: c.id,
    name: c.name,
    slug: c.slug,
    logo,
    website: c.website || null,
    oneLiner: c.one_liner || null,
    longDescription: c.long_description || null,
    batch: c.batch || null,
    industries,
    regions: Array.isArray(c.regions) ? c.regions.filter(Boolean) : [],
    isHiring: Boolean(c.isHiring),
    teamSize: typeof c.team_size === "number" ? c.team_size : null,
    status: c.status || null,
  };
}

async function fetchAllCompanies() {
  const res = await fetch(YC_ALL_COMPANIES_URL);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch YC companies: ${res.status} ${res.statusText}`
    );
  }
  const data = (await res.json()) as YcApiCompany[];
  if (!Array.isArray(data)) throw new Error("YC API response was not an array");
  return data;
}

async function main() {
  dotenv.config({ path: ".env.local" });

  console.log("Connecting to MongoDB...");
  await connectToMongo();

  console.log("Fetching YC companies...");
  const companies = await fetchAllCompanies();
  console.log(`Fetched ${companies.length} companies`);

  const chunkSize = 500;
  let upserted = 0;

  for (let i = 0; i < companies.length; i += chunkSize) {
    const chunk = companies.slice(i, i + chunkSize);
    const ops = chunk.map((c) => {
      const doc = normalizeCompany(c);
      return {
        updateOne: {
          filter: { ycId: doc.ycId },
          update: { $set: doc },
          upsert: true,
        },
      };
    });

    const result = await YcStartupModel.bulkWrite(ops, { ordered: false });
    upserted += result.upsertedCount;

    console.log(
      `Seed progress: ${Math.min(i + chunk.length, companies.length)}/${companies.length}`
    );
  }

  const totalInDb = await YcStartupModel.countDocuments();

  console.log(
    `Done. Upserted: ${upserted}. Total YC startups in DB: ${totalInDb}.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
