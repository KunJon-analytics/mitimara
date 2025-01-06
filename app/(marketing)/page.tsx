import { FAQs } from "@/components/marketing/home/faqs";
import { Hero } from "@/components/marketing/home/hero";
import HowItWorks from "@/components/marketing/home/how-it-works";

export default function Home() {
  return (
    <div className="grid gap-12">
      <Hero />
      <HowItWorks />
      <FAQs />
    </div>
  );
}
