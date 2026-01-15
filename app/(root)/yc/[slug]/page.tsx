import Link from "next/link";
import Image from "next/image";
import { getYcStartupBySlug } from "@/mongodb/ycStartups";

export default async function YcStartupDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const startup = await getYcStartupBySlug(slug);

  if (!startup) {
    return (
      <section className="section_container">
        <p className="text-30-semibold">YC startup not found</p>
        <Link className="underline text-16-medium" href="/yc">
          Back to YC startups
        </Link>
      </section>
    );
  }

  const logo = startup.logo?.includes("missing.png") ? null : startup.logo;

  return (
    <>
      <section className="!min-h-[50px] pink_container">
        <p className="tag">YC Startup</p>
        <h1 className="heading">{startup.name}</h1>
        <p className="sub-heading !max-w-3xl">{startup.oneLiner || ""}</p>
      </section>

      <section className="section_container">
        <div className="flex flex-col gap-6 rounded-[22px] border-5 border-black bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            {logo ? (
              <Image
                src={logo}
                alt={`${startup.name} logo`}
                width={80}
                height={80}
                className="rounded-xl border border-black/10 bg-white object-contain"
              />
            ) : null}

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {startup.batch ? (
                  <span className="yc-pill">{startup.batch}</span>
                ) : null}
                {startup.status ? (
                  <span className="yc-pill">{startup.status}</span>
                ) : null}
                {startup.isHiring ? (
                  <span className="yc-badge yc-badge--hiring">Hiring</span>
                ) : (
                  <span className="yc-badge yc-badge--not_hiring">
                    Not hiring
                  </span>
                )}
              </div>

              {startup.website ? (
                <Link
                  className="mt-3 inline-block text-16-medium underline"
                  href={startup.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit website
                </Link>
              ) : null}
            </div>
          </div>

          {startup.longDescription ? (
            <p className="text-16-medium text-black/80 leading-7">
              {startup.longDescription}
            </p>
          ) : null}

          {Array.isArray(startup.industries) && startup.industries.length ? (
            <div>
              <p className="text-16-medium mb-2">Industries</p>
              <div className="flex flex-wrap gap-2">
                {startup.industries.map((x: string) => (
                  <span key={x} className="yc-pill">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {Array.isArray(startup.regions) && startup.regions.length ? (
            <div>
              <p className="text-16-medium mb-2">Regions</p>
              <div className="flex flex-wrap gap-2">
                {startup.regions.map((x: string) => (
                  <span key={x} className="yc-pill">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex-between">
            <Link className="underline text-16-medium" href="/yc">
              Back to YC startups
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
