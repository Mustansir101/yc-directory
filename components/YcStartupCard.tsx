import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { YcStartupListItem } from "@/mongodb/ycStartups";

const YcStartupCard = ({ startup }: { startup: YcStartupListItem }) => {
  const industry = startup.industries?.[0] || "";
  const logo = startup.logo?.includes("missing.png") ? null : startup.logo;

  function truncate(text: string, maxLength: number) {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  return (
    <li className="yc-card group">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          {logo ? (
            <Image
              src={logo}
              alt={`${startup.name} logo`}
              width={44}
              height={44}
              className="rounded-lg border border-black/10 bg-white object-contain"
            />
          ) : (
            <div className="flex h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-black/10 text-white text-16-medium">
              {startup.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <Link href={`/yc/${startup.slug}`}>
              <h3 className="text-20-medium line-clamp-1">
                {truncate(startup.name, 18)}
              </h3>
            </Link>
            {startup.oneLiner ? (
              <p className="yc-card_desc line-clamp-2">{startup.oneLiner}</p>
            ) : (
              <p className="yc-card_desc text-black/50">No description</p>
            )}
          </div>
        </div>

        {startup.isHiring ? (
          <span className="yc-badge yc-badge--hiring">Hiring</span>
        ) : (
          <span className="yc-badge yc-badge--not_hiring">Not hiring</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {startup.batch ? (
          <span className="yc-pill">{startup.batch}</span>
        ) : null}
        {industry ? <span className="yc-pill">{industry}</span> : null}
        {startup.status ? (
          <span className="yc-pill">{startup.status}</span>
        ) : null}
        {typeof startup.teamSize === "number" ? (
          <span className="yc-pill">Team {startup.teamSize}</span>
        ) : null}
      </div>

      <div className="mt-5 pt-4 flex-between gap-3 yc-card-footer">
        <Button className="startup-card_btn" asChild>
          <Link href={`/yc/${startup.slug}`}>Details</Link>
        </Button>

        {startup.website ? (
          <Link
            className="text-16-medium underline"
            href={startup.website}
            target="_blank"
            rel="noreferrer"
          >
            Website
          </Link>
        ) : null}
      </div>
    </li>
  );
};

export default YcStartupCard;
