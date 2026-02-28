"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { adminUserUpdateSchema, type AdminUserUpdateInput } from "@/lib/schemas";
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
import { updateUser } from "../actions";

type Props = {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    memberType: "MEMBER" | "GUEST";
    customRoleId: string | null;
    zoneId: string | null;
    streetId: string | null;
    houseNumber: string | null;
    isApproved: boolean;
    isActive: boolean;
    patrolOptIn: boolean;
    hideFromNeighbours: boolean;
    secondaryContactName: string | null;
    secondaryContactPhone: string | null;
    secondaryContactEmail: string | null;
    whatsappOptIn: boolean;
    whatsappPhone: string | null;
  };
  roles: { id: string; name: string }[];
  zones: { id: string; name: string }[];
  streets: { id: string; name: string; zoneId: string }[];
};

export function EditUserForm({ user, roles, zones, streets }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserUpdateInput>({
    resolver: zodResolver(adminUserUpdateSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      memberType: user.memberType,
      customRoleId: user.customRoleId ?? "",
      zoneId: user.zoneId ?? "",
      streetId: user.streetId ?? "",
      houseNumber: user.houseNumber ?? "",
      isApproved: user.isApproved,
      isActive: user.isActive,
      patrolOptIn: user.patrolOptIn,
      hideFromNeighbours: user.hideFromNeighbours,
      secondaryContactName: user.secondaryContactName ?? "",
      secondaryContactPhone: user.secondaryContactPhone ?? "",
      secondaryContactEmail: user.secondaryContactEmail ?? "",
      whatsappOptIn: user.whatsappOptIn,
      whatsappPhone: user.whatsappPhone ?? "",
    },
  });

  const selectedZoneId = watch("zoneId");
  const filteredStreets = streets.filter((s) => s.zoneId === selectedZoneId);

  async function onSubmit(data: AdminUserUpdateInput) {
    const result = await updateUser(user.id, data);
    if (result.ok) {
      toast.success("User updated");
      router.push("/admin/users");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Member type</Label>
          <Select
            value={watch("memberType") ?? "GUEST"}
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
          <Label>Role</Label>
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
          <div className="flex items-center gap-3">
            <Switch
              id="patrolOptIn"
              checked={watch("patrolOptIn")}
              onCheckedChange={(v) => setValue("patrolOptIn", v)}
            />
            <Label htmlFor="patrolOptIn">Patrol opt-in</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="hideFromNeighbours"
              checked={watch("hideFromNeighbours")}
              onCheckedChange={(v) => setValue("hideFromNeighbours", v)}
            />
            <Label htmlFor="hideFromNeighbours">Hide from neighbours</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-sm font-semibold">Secondary contact</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="secondaryContactName">Name</Label>
            <Input id="secondaryContactName" {...register("secondaryContactName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryContactPhone">Phone</Label>
            <Input id="secondaryContactPhone" {...register("secondaryContactPhone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryContactEmail">Email</Label>
            <Input id="secondaryContactEmail" type="email" {...register("secondaryContactEmail")} />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-sm font-semibold">WhatsApp</h3>
        <div className="flex items-center gap-3">
          <Switch
            id="whatsappOptIn"
            checked={watch("whatsappOptIn")}
            onCheckedChange={(v) => setValue("whatsappOptIn", v)}
          />
          <Label htmlFor="whatsappOptIn">WhatsApp opt-in</Label>
        </div>
        {watch("whatsappOptIn") && (
          <div className="space-y-2">
            <Label htmlFor="whatsappPhone">WhatsApp number</Label>
            <Input id="whatsappPhone" {...register("whatsappPhone")} />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
