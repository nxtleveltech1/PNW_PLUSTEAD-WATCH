"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Archive, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { archiveConversation, deleteConversation } from "@/lib/messaging";

export function ConversationActions({ conversationId }: { conversationId: string }) {
  const router = useRouter();

  async function handleArchive() {
    const result = await archiveConversation(conversationId);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Conversation archived.");
    router.push("/account/inbox");
  }

  async function handleDelete() {
    const result = await deleteConversation(conversationId);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success("Conversation removed from inbox.");
    router.push("/account/inbox");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleArchive} className="cursor-pointer">
          <Archive className="h-4 w-4" />
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
