import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Verification = {
  id: string;
  verifier: {
    username: string;
  };
  createdAt: Date;
  rewardClaimed: boolean;
};

type VerificationTableProps = {
  verifications: Verification[];
};

export function VerificationTable({ verifications }: VerificationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Verifier</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Reward Claimed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {verifications.map((verification) => (
          <TableRow key={verification.id}>
            <TableCell>{verification.verifier.username}</TableCell>
            <TableCell>{verification.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>{verification.rewardClaimed ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
