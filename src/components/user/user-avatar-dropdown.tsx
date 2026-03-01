"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { ChevronDown, LayoutDashboard, LogOut, Mail, Settings, ShieldCheck, User } from "lucide-react";
import { InboxBadge } from "@/components/inbox/inbox-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function getInitials(firstName: string | null, lastName: string | null, email: string): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) return firstName.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

export function UserAvatarDropdown({ showAdmin = false }: { showAdmin?: boolean }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded || !user) return null;

  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || primaryEmail || "Member";
  const initials = getInitials(user.firstName, user.lastName, primaryEmail);

  async function handleSignOut() {
    await signOut({ redirectUrl: "/" });
    router.push("/");
  }

  return (
    <div className="flex items-center gap-0.5">
      <InboxBadge />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="h-8 w-8 rounded-full border-2 border-primary/20">
              <AvatarImage src={user.imageUrl} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 border-[hsl(220,50%,25%)] bg-[hsl(220,68%,15%)] text-white shadow-xl"
        >
          <div className="px-2 py-2">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs truncate text-white/50">
              {primaryEmail}
            </p>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          {showAdmin && (
            <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white">
              <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                <ShieldCheck className="h-4 w-4" />
                Administration
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white">
            <Link href="/account/inbox" className="flex items-center gap-2 cursor-pointer">
              <Mail className="h-4 w-4" />
              Inbox
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white">
            <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white">
            <Link href="/account" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-white/80 focus:bg-white/10 focus:text-white">
            <Link href="/account/settings" className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            className="text-[hsl(8,85%,65%)] focus:bg-[hsl(8,85%,50%)]/15 focus:text-[hsl(8,85%,60%)] cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
