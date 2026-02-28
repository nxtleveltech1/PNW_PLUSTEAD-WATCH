"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2, UserX, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toggleUserActive, deleteUser } from "./actions";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  memberNumber: number;
  roleName: string | null;
  zoneName: string | null;
  memberType: string;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
};

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

const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "memberNumber",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("memberNumber")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/admin/users/${row.original.id}`}
        className="font-medium text-primary hover:underline"
      >
        {row.getValue("name")}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "roleName",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("roleName") as string | null;
      return role ? (
        <Badge variant="secondary">{role}</Badge>
      ) : (
        <span className="text-muted-foreground">--</span>
      );
    },
  },
  {
    accessorKey: "zoneName",
    header: "Zone",
    cell: ({ row }) => row.getValue("zoneName") ?? <span className="text-muted-foreground">--</span>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("isActive") as boolean;
      return (
        <Badge variant={active ? "default" : "secondary"}>
          {active ? "Active" : "Suspended"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isApproved",
    header: "Approved",
    cell: ({ row }) => {
      const approved = row.getValue("isApproved") as boolean;
      return approved ? (
        <span className="text-sm text-green-600">Yes</span>
      ) : (
        <span className="text-sm text-muted-foreground">No</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
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
    cell: ({ row }) => <RowActions user={row.original} />,
  },
];

function RowActions({ user }: { user: UserRow }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="flex justify-end gap-1">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/users/${user.id}`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <form
          action={async () => {
            await toggleUserActive(user.id);
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            title={user.isActive ? "Suspend user" : "Activate user"}
          >
            {user.isActive ? (
              <UserX className="h-4 w-4 text-amber-600" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-600" />
            )}
          </Button>
        </form>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong>{user.name}</strong> ({user.email})?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await deleteUser(user.id);
                setDeleteOpen(false);
                setLoading(false);
              }}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function UsersTable({ data }: { data: UserRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    const q = globalFilter.toLowerCase();
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.roleName?.toLowerCase().includes(q) ?? false) ||
        (u.zoneName?.toLowerCase().includes(q) ?? false),
    );
  }, [data, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name, email, role, or zone..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : header.column.getCanSort()
                        ? (
                            <SortableHeader column={header.column}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </SortableHeader>
                          )
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filteredData.length} of {data.length} users
      </p>
    </div>
  );
}
