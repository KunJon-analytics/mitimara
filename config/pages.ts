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
    href: "/legal/terms",
    title: "Terms",
    description: "Check our terms and conditions.",
    segment: "Terms",
    icon: "terms",
  },
  {
    href: "/legal/privacy",
    title: "Privacy",
    description: "View our privacy policy",
    segment: "Privacy",
    icon: "privacy",
  },
] as const satisfies Page[];

export const marketingPagesConfig = [
  {
    href: "/legal/terms",
    description: `Find out about ${siteConfig.name}`,
    title: "Company",
    segment: "",
    icon: "library",
    children: marketingCompanyPagesConfig,
  },
  {
    href: "/about",
    title: "About",
    description: "About us",
    segment: "about",
    icon: "book",
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
