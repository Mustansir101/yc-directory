import Link from "next/link";
import { cn } from "@/lib/utils";

export default function StartupSourceToggle({
  active,
}: {
  active: "community" | "yc";
}) {
  return (
    <div className="mt-6 flex items-center gap-2 rounded-full border-3 border-black bg-white p-1 shadow-sm">
      <Link
        href="/"
        className={cn(
          "rounded-full px-4 py-2 text-16-medium transition-colors",
          active === "community" ? "bg-black text-white" : "text-black"
        )}
      >
        Community Startups
      </Link>
      <Link
        href="/yc"
        className={cn(
          "rounded-full px-4 py-2 text-16-medium transition-colors",
          active === "yc" ? "bg-black text-white" : "text-black"
        )}
      >
        YC Startups
      </Link>
    </div>
  );
}
