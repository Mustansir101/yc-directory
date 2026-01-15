import StartupSourceToggle from "@/components/StartupSourceToggle";
import YcSearchForm from "@/components/YcSearchForm";
import YcStartupCard from "@/components/YcStartupCard";
import { listYcStartups } from "@/mongodb/ycStartups";
import Link from "next/link";

export default async function YcStartupsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const query = sp.query || "";
  const page = Number(sp.page || "1");

  const result = await listYcStartups({
    search: query,
    page: Number.isFinite(page) ? page : 1,
    limit: 24,
  });

  const prevHref = `/yc?query=${encodeURIComponent(query)}&page=${Math.max(1, result.page - 1)}`;
  const nextHref = `/yc?query=${encodeURIComponent(query)}&page=${Math.min(result.pages, result.page + 1)}`;

  return (
    <>
      <section className="pink_container">
        <p className="tag">Browse YC Companies</p>
        <h1 className="heading">Explore YC startups</h1>
        <p className="sub-heading !max-w-3xl">
          Discover innovative startups from Y Combinator's extensive network.
        </p>
        <YcSearchForm query={query} />
        <StartupSourceToggle active="yc" />
      </section>

      <section className="section_container">
        <div className="flex-between gap-4">
          <p className="text-30-semibold">
            {query ? `Search Results for "${query}"` : "YC Startups"}
          </p>
          <p className="text-16-medium text-black/60">
            {result.total.toLocaleString()} total
          </p>
        </div>

        <ul className="mt-7 card_grid">
          {result.items.length > 0 ? (
            result.items.map((startup) => (
              <YcStartupCard key={startup.ycId} startup={startup} />
            ))
          ) : (
            <p className="no-result">No results found</p>
          )}
        </ul>

        {result.pages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              className={`text-16-medium ${result.page === 1 ? "pointer-events-none opacity-40" : "underline"}`}
              href={prevHref}
              scroll={false}
            >
              Prev
            </Link>
            <span className="text-16-medium">
              Page {result.page} of {result.pages}
            </span>
            <Link
              className={`text-16-medium ${result.page === result.pages ? "pointer-events-none opacity-40" : "underline"}`}
              href={nextHref}
              scroll={false}
            >
              Next
            </Link>
          </div>
        ) : null}
      </section>
    </>
  );
}
