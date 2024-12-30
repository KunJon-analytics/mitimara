import type { ValidIcon } from "@/components/common/icons";

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

export const marketingResourcePagesConfig = [
  {
    href: "/#earnings-checker",
    title: "Earnings Checker",
    description: "Check your accrued earnings and performance.",
    segment: "Earnings Checker",
    icon: "bot",
  },
  {
    href: "/#faq",
    title: "FAQ",
    description: "Find answers to common questions.",
    segment: "FAQ",
    icon: "puzzle",
  },
] as const satisfies Page[];

export const marketingPagesConfig = [
  {
    href: "/#faq",
    description: "Find articles, guides, and FAQs.",
    title: "Resources",
    segment: "",
    icon: "library",
    children: marketingResourcePagesConfig,
  },
  {
    href: "/#tranches",
    title: "Investment Tranches",
    description: "Explore our different investment plans.",
    segment: "tranches",
    icon: "credit-card",
  },
  {
    href: "/#how-it-works",
    title: "How It Works",
    description: "Learn how our AI investment platform operates.",
    segment: "",
    icon: "cog",
  },
  {
    href: "/#testimonial",
    title: "Testimonial",
    description: "Read success stories from our satisfied clients.",
    segment: "Testimonial",
    icon: "siren",
  },
] satisfies Page[];
