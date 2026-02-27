"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Shield } from "lucide-react";
import { toast } from "sonner";

export function SecurityForm() {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsSubmitting(true);
    try {
      await user.updatePassword({
        currentPassword: currentPassword || undefined,
        newPassword,
      });
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasPassword = user?.passwordEnabled ?? false;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold">Password</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasPassword
                ? "Change your password. It must be at least 8 characters."
                : "Set a password for your account."}
            </p>
            <form
              onSubmit={handlePasswordChange}
              className="mt-4 space-y-4 max-w-sm"
            >
              {hasPassword && (
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    Current password
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1"
                  />
                </div>
              )}
              <div>
                <label htmlFor="newPassword" className="text-sm font-medium">
                  New password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm new password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update password"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/30 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold">Two-factor authentication</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an extra layer of security with an authenticator app. Two-factor
              setup is available when you sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
