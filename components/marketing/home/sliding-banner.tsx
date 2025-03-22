import Link from "next/link";

import { getIntroAnnouncement } from "@/lib/services/stats";

export function SlidingBanner() {
  const announcement = getIntroAnnouncement();

  return (
    <div className="bg-green-100 p-4 rounded-lg shadow-md overflow-hidden h-16">
      <div className="relative h-full flex items-center">
        <div className="absolute animate-ticker whitespace-nowrap text-green-800">
          <Link
            className="hover:underline"
            href={"/blog/mitimara-city-bounty-contests"}
          >
            {announcement}
          </Link>
        </div>
      </div>
    </div>
  );
}
