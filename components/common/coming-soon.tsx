import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ComingSoonCard() {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative w-full h-64">
          <Image
            src="/assets/coming-soon.png"
            alt="Coming Soon"
            priority
            fill
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 text-center">
        <CardTitle className="text-3xl font-bold mb-4">Coming Soon</CardTitle>
        <p className="text-lg text-muted-foreground mb-6">
          We are working hard to bring you something amazing. Stay tuned for our
          big reveal!
        </p>
        <Button asChild className="w-full">
          <Link href={"/roadmap"}> Learn More</Link>
        </Button>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        <p className="w-full underline">
          <Link href={"/telegram"}>Follow us on social media for updates</Link>
        </p>
      </CardFooter>
    </Card>
  );
}
