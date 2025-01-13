import { toDate } from "date-fns";

type Post = { slug: string; publishedAt: Date };

const launchDate = toDate(new Date(2025, 0, 14));

export const allPosts: Post[] = [
  { publishedAt: launchDate, slug: "/how-to-plant-a-tree" },
  { publishedAt: launchDate, slug: "/how-to-verify-a-tree" },
];
