"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { approvePayment, rejectPayment } from "./actions";

export type PaymentRow = {
  id: string;
  userName: string;
  email: string;
  amount: number;
  method: "PAYSTACK" | "EFT";
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  paidAt: string | null;
};

function StatusBadge({ status }: { status: PaymentRow["status"] }) {
  switch (status) {
    case "PAID":
      return <Badge variant="default">Paid</Badge>;
    case "PENDING":
      return <Badge variant="secondary">Pending</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>;
  }
}

const columns: ColumnDef<PaymentRow>[] = [
  {
    accessorKey: "userName",
    header: "Member",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("userName")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <a
        href={`mailto:${row.getValue("email")}`}
        className="text-primary hover:underline"
      >
        {row.getValue("email")}
      </a>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `R${((row.getValue("amount") as number) / 100).toFixed(0)}`,
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => (
      <span className="text-xs uppercase tracking-wide">
        {row.getValue("method")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt") as string).toLocaleDateString(
        "en-ZA",
        { day: "numeric", month: "short", year: "numeric" },
      ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => {
      if (row.original.status !== "PENDING") return null;
      return (
        <div className="flex items-center justify-end gap-2">
          <form action={approvePayment.bind(null, row.original.id)}>
            <Button type="submit" size="sm" variant="default">
              Approve
            </Button>
          </form>
          <form action={rejectPayment.bind(null, row.original.id)}>
            <Button type="submit" size="sm" variant="outline">
              Reject
            </Button>
          </form>
        </div>
      );
    },
  },
];

function SortableHeader({
  column,
  children,
}: {
  column: {
    getIsSorted: () => false | "asc" | "desc";
    getToggleSortingHandler: () => ((e: unknown) => void) | undefined;
  };
  children: React.ReactNode;
}) {
  const sort = column.getIsSorted();
  return (
    <button
      type="button"
      className="flex items-center gap-1 hover:text-foreground"
      onClick={column.getToggleSortingHandler()}
    >
      {children}
      {sort === "asc" ? (
        <ArrowUp className="h-4 w-4" />
      ) : sort === "desc" ? (
        <ArrowDown className="h-4 w-4" />
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      )}
    </button>
  );
}

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const table = useReactTable({
    data: payments,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.id === "actions" ? (
                    <span className="sr-only">Actions</span>
                  ) : header.column.getCanSort() ? (
                    <SortableHeader column={header.column}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </SortableHeader>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                No payments yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
