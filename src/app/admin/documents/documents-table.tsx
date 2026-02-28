"use client";

import Link from "next/link";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteDocument } from "./actions";

export type DocumentRow = {
  id: string;
  name: string;
  categoryName: string;
  fileUrl: string;
  createdAt: string;
};

const columns: ColumnDef<DocumentRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <a
        href={row.original.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("name")}
      </a>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: "Added",
    cell: ({ row }) =>
      new Date(row.getValue("createdAt") as string).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/documents/${row.original.id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <form action={deleteDocument.bind(null, row.original.id)} className="inline">
          <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </form>
      </div>
    ),
  },
];

function SortableHeader({
  column,
  children,
}: {
  column: { getIsSorted: () => false | "asc" | "desc"; getToggleSortingHandler: () => ((e: unknown) => void) | undefined };
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

export function DocumentsTable({ data }: { data: DocumentRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);

  const table = useReactTable({
    data,
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
                  {header.isPlaceholder
                    ? null
                    : header.column.getCanSort() ? (
                        <SortableHeader column={header.column}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </SortableHeader>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                No documents.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
