import { MarketingLayout } from "@/components/marketing/layout/marketing-layout";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return <MarketingLayout>{children}</MarketingLayout>;
}
