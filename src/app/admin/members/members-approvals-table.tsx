"use client";

import { approveMember, rejectMember } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState } from "react";

export type MemberRow = {
  id: string;
  name: string;
  email: string;
  zone: string | null;
  street: string | null;
  houseNumber: string | null;
  isApproved: boolean;
  createdAt: string;
};

const columns: ColumnDef<MemberRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
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
    accessorKey: "zone",
    header: "Zone",
    cell: ({ row }) => row.getValue("zone") ?? "—",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const street = row.original.street;
      const house = row.original.houseNumber;
      if (!street && !house) return "—";
      return [house, street].filter(Boolean).join(" ") ?? "—";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt") as string).toLocaleDateString(
        "en-ZA",
        { day: "numeric", month: "short", year: "numeric" }
      ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => {
      const isApproved = row.original.isApproved;
      return (
        <div className="flex items-center justify-end gap-2">
          {isApproved ? (
            <Badge variant="default">Approved</Badge>
          ) : (
            <>
              <form action={approveMember.bind(null, row.original.id)}>
                <Button type="submit" size="sm" variant="default">
                  Approve
                </Button>
              </form>
              <form action={rejectMember.bind(null, row.original.id)}>
                <Button type="submit" size="sm" variant="outline">
                  Reject
                </Button>
              </form>
            </>
          )}
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

export function MembersApprovalsTable({ members }: { members: MemberRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const table = useReactTable({
    data: members,
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
                        header.getContext()
                      )}
                    </SortableHeader>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
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
                      cell.getContext()
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
                No members yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
