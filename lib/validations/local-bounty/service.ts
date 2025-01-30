import { getBountyHuntById } from "@/lib/services/bounty-hunt";

export type GetBountyHuntDetail = Awaited<ReturnType<typeof getBountyHuntById>>;

export type BountyHuntModalParam = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string | null;
  location: string | null;
  radius: number;
  centerLongitude: number;
  centerLatitude: number;
  totalBounty: number;
};
