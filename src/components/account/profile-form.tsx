"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileUpdateSchema } from "@/lib/schemas";
import { updateProfile } from "@/app/(auth)/account/actions";
import { toast } from "sonner";

type Schema = z.infer<typeof profileUpdateSchema>;

export function ProfileForm({
  firstName,
  lastName,
  email,
  imageUrl,
}: {
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string;
}) {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<Schema>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
    },
  });

  async function onSubmit(values: Schema) {
    if (!user) return;
    try {
      await user.update({
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
      });
      const result = await updateProfile({
        firstName: values.firstName || null,
        lastName: values.lastName || null,
      });
      if (result.ok) {
        toast.success("Profile updated");
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      await user.setProfileImage({ file });
      await user.reload();
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update picture");
    }
  }

  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((n) => n![0])
    .join("")
    .toUpperCase() || email.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={imageUrl} alt="Profile" />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Change photo
          </Button>
          <p className="mt-1 text-xs text-muted-foreground">
            JPG, PNG or GIF. Max 4MB.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First name"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last name"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Email</FormLabel>
            <Input value={email} disabled className="bg-muted" />
            <p className="mt-1 text-xs text-muted-foreground">
              Email is managed by your account provider.
            </p>
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
