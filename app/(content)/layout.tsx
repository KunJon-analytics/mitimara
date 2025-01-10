import { MarketingLayout } from "@/components/marketing/layout/marketing-layout";
import ContentContainer from "@/components/content/content-container";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <MarketingLayout>
      <ContentContainer>{children}</ContentContainer>
    </MarketingLayout>
  );
}
