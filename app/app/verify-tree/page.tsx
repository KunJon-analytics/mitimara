import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function VerifyTree() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Verify Trees</h1>
      <p>Here you can verify tree plantings submitted by other users.</p>
      {/* TODO: Add list of trees to verify and verification interface */}
      <div>
        <Button asChild>
          <Link href="/app">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
