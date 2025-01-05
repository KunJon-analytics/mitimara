import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProfileStats from "./_components/profile-stats";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <ProfileStats />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plant a Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Submit a new tree planting entry and earn rewards!
            </p>
            <Button asChild>
              <Link href="/app/plant-tree">Plant Tree</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verify Trees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Help verify other users' tree plantings and earn rewards!
            </p>
            <Button asChild>
              <Link href="/app/verify-tree">Verify Trees</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
