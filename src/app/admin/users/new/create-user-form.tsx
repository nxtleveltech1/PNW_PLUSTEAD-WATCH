"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminUserCreateSchema, type AdminUserCreateInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "../actions";

type Props = {
  roles: { id: string; name: string }[];
  zones: { id: string; name: string }[];
  streets: { id: string; name: string; zoneId: string }[];
  defaultRoleId: string;
};

export function CreateUserForm({ roles, zones, streets, defaultRoleId }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserCreateInput>({
    resolver: zodResolver(adminUserCreateSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      memberType: "GUEST",
      customRoleId: defaultRoleId,
      zoneId: "",
      streetId: "",
      houseNumber: "",
      isApproved: false,
      isActive: true,
      patrolOptIn: false,
      hideFromNeighbours: false,
      secondaryContactName: "",
      secondaryContactPhone: "",
      secondaryContactEmail: "",
      whatsappOptIn: false,
      whatsappPhone: "",
    },
  });

  const selectedZoneId = watch("zoneId");
  const filteredStreets = streets.filter((s) => s.zoneId === selectedZoneId);

  async function onSubmit(data: AdminUserCreateInput) {
    const result = await createUser(data);
    if (result.ok) {
      toast.success("User created");
      router.push("/admin/users");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" {...register("firstName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" {...register("lastName")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Member type</Label>
          <Select
            value={watch("memberType")}
            onValueChange={(v) => setValue("memberType", v as "MEMBER" | "GUEST")}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="GUEST">Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Role *</Label>
          <Select
            value={watch("customRoleId")}
            onValueChange={(v) => setValue("customRoleId", v)}
          >
            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.customRoleId && <p className="text-sm text-destructive">{errors.customRoleId.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Zone</Label>
          <Select
            value={watch("zoneId") ?? ""}
            onValueChange={(v) => {
              setValue("zoneId", v === "__none" ? "" : v);
              setValue("streetId", "");
            }}
          >
            <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">None</SelectItem>
              {zones.map((z) => (
                <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Street</Label>
          <Select
            value={watch("streetId") ?? ""}
            onValueChange={(v) => setValue("streetId", v === "__none" ? "" : v)}
          >
            <SelectTrigger><SelectValue placeholder="Select street" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">None</SelectItem>
              {filteredStreets.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="houseNumber">House #</Label>
          <Input id="houseNumber" {...register("houseNumber")} />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-sm font-semibold">Flags</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Switch
              id="isApproved"
              checked={watch("isApproved")}
              onCheckedChange={(v) => setValue("isApproved", v)}
            />
            <Label htmlFor="isApproved">Approved</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(v) => setValue("isActive", v)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        The user will be created without a Clerk account. When they sign up with this email, their account will be linked automatically.
      </p>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create user"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
