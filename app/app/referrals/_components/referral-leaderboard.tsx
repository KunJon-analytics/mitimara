import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";

export default async function ReferralLeaderboard() {
  const leaderboardData = await prisma.user.findMany({
    orderBy: { noOfReferrals: "desc" },
    take: 10,
    select: { username: true, noOfReferrals: true },
  });

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Referral Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Position</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Referrals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((user, index) => (
              <TableRow key={user.username}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell className="text-right">
                  {user.noOfReferrals}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
