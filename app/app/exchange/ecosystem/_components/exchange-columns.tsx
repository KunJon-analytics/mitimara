import type { ColumnDef } from "@tanstack/react-table";
import { PointsForPiExchange } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  getExchangeStatus,
  getExchangeStatusBadge,
} from "@/lib/exchanges/utils";
import { Button } from "@/components/ui/button";

export type ExchangeData = Pick<
  PointsForPiExchange,
  "updatedAt" | "amount" | "id" | "status"
>;

export const columns: ColumnDef<ExchangeData>[] = [
  {
    accessorKey: "updatedAt",
    enableHiding: false,
    header: "Date",
    cell: ({ row }) => {
      const updated = row.original.updatedAt;
      return (
        <div className="text-center">
          {formatDistanceToNow(updated, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount (π)",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return <div className="text-center">{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="text-center">
          <Badge variant={getExchangeStatusBadge(status)}>
            {getExchangeStatus(status)}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Button variant="ghost" asChild className="h-8 w-8 p-0">
          <Link href={`/app/exchange/ecosystem/${item.id}`}>
            <span className="sr-only">View Details</span>
            <Eye />
          </Link>
        </Button>
      );
    },
  },
];
