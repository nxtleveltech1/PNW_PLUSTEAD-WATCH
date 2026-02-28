"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil, Trash2, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteRole } from "./actions";

export type RoleRow = {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  userCount: number;
  permissionCount: number;
};

function RoleCard({ role }: { role: RoleRow }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between rounded-lg border bg-card p-4 transition-colors hover:border-primary/30">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <Link
              href={`/admin/roles/${role.id}`}
              className="font-medium text-primary hover:underline"
            >
              {role.name}
            </Link>
            {role.isSystem && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <Lock className="h-3 w-3" />
                System
              </Badge>
            )}
          </div>
          {role.description && (
            <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
          )}
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span>{role.userCount} {role.userCount === 1 ? "user" : "users"}</span>
            <span>{role.permissionCount} {role.permissionCount === 1 ? "permission" : "permissions"}</span>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/roles/${role.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          {!role.isSystem && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{role.name}</strong>?
              {role.userCount > 0 && (
                <> {role.userCount} {role.userCount === 1 ? "user" : "users"} will be reassigned to the Member role.</>
              )}
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
                await deleteRole(role.id);
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

export function RolesTable({ roles }: { roles: RoleRow[] }) {
  return (
    <div className="space-y-3">
      {roles.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No roles defined.</p>
      ) : (
        roles.map((role) => <RoleCard key={role.id} role={role} />)
      )}
    </div>
  );
}
