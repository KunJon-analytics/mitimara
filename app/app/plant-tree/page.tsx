import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function PlantTree() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Plant a Tree</h1>
      <p>Here you can submit details about the tree you've planted.</p>
      {/* TODO: Add form for tree planting submission */}
      <div>
        <Button asChild>
          <Link href="/app">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
