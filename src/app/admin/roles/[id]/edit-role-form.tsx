"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminRoleUpdateSchema, type AdminRoleUpdateInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { updateRole } from "../actions";

type PermissionItem = {
  key: string;
  label: string;
  groupName: string;
};

type Props = {
  role: {
    id: string;
    name: string;
    description: string | null;
    isSystem: boolean;
    permissionKeys: string[];
  };
  allPermissions: PermissionItem[];
};

export function EditRoleForm({ role, allPermissions }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminRoleUpdateInput>({
    resolver: zodResolver(adminRoleUpdateSchema),
    defaultValues: {
      name: role.name,
      description: role.description ?? "",
      permissionKeys: role.permissionKeys,
    },
  });

  const selectedKeys = watch("permissionKeys") ?? [];

  function togglePermission(key: string) {
    const current = selectedKeys;
    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    setValue("permissionKeys", next, { shouldDirty: true });
  }

  const groups = allPermissions.reduce<Record<string, PermissionItem[]>>((acc, p) => {
    (acc[p.groupName] ??= []).push(p);
    return acc;
  }, {});

  async function onSubmit(data: AdminRoleUpdateInput) {
    const result = await updateRole(role.id, data);
    if (result.ok) {
      toast.success("Role updated");
      router.push("/admin/roles");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Role name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register("description")} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Permissions</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groups).map(([group, perms]) => (
            <div key={group} className="rounded-lg border p-4">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group}
              </h4>
              <div className="space-y-2">
                {perms.map((p) => (
                  <label
                    key={p.key}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={selectedKeys.includes(p.key)}
                      onCheckedChange={() => togglePermission(p.key)}
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/roles")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
