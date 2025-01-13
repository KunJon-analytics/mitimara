import type { ValidIcon } from "@/components/common/icons";
import { siteConfig } from "./site";

export type Page = {
  title: string;
  subtitle?: string;
  description: string;
  href: string;
  icon: ValidIcon;
  disabled?: boolean;
  segment: string;
  children?: Page[];
};

export const marketingCompanyPagesConfig = [
  {
    href: "/about",
    title: "About",
    description: "Empowering global tree-planting with Pi tokens. 🌍💚",
    segment: "about",
    icon: "book",
  },
  {
    href: "/roadmap",
    title: "Roadmap",
    description: `Track ${siteConfig.name}'s features and future plans. 🚀🌱`,
    segment: "roadmap",
    icon: "route",
  },
] as const satisfies Page[];

export const marketingPagesConfig = [
  {
    href: "/about",
    description: `Find out about ${siteConfig.name}`,
    title: "Company",
    segment: "",
    icon: "library",
    children: marketingCompanyPagesConfig,
  },
  {
    href: "/#how-it-works",
    title: "How It Works",
    description: "Learn how to contribute to the planet.",
    segment: "",
    icon: "cog",
  },
  {
    href: "/#faq",
    title: "FAQ",
    description: "Find answers to common questions.",
    segment: "FAQ",
    icon: "puzzle",
  },
] satisfies Page[];
