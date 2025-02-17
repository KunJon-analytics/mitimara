import Link from "next/link";

import { getAnnouncement } from "@/lib/services/stats";
import { env } from "@/env.mjs";

export async function SlidingBanner() {
  const announcement = await getAnnouncement();

  return (
    <div className="bg-green-100 p-4 rounded-lg shadow-md overflow-hidden h-16">
      <div className="relative h-full flex items-center">
        <div className="absolute animate-ticker whitespace-nowrap text-green-800">
          <Link
            className="hover:underline"
            href={
              env.NEXT_PUBLIC_TESTNET_REWARD
                ? "/revenue-pots"
                : "/app/local-bounty"
            }
          >
            {announcement}
          </Link>
        </div>
      </div>
    </div>
  );
}
