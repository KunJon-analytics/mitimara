import type { ValidIcon } from "@/components/common/icons";

export type Social = {
  title: string;
  href: string;
  icon: ValidIcon;
};

export const socialsConfig: Social[] = [
  {
    title: "Telegram",
    href: "/telegram",
    icon: "telegram",
  },
  {
    title: "Twitter",
    href: "/twitter",
    icon: "twitter",
  },
];
