"use client";

import { Eye, MoreHorizontal, Power, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
    deleteAgent, toggleAgentStatus
} from "@/app/admin/(dashboard)/agents/actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AgentDetailDialog } from "./AgentDetailDialog";

interface AgentActionsProps {
  agent: any;
}

export function AgentActions({ agent }: AgentActionsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const agentId = agent._id.toString();
  const agentName = agent.name;
  const isActive = agent.status === "active";

  async function onToggleStatus() {
    setIsPending(true);
    try {
      const result = await toggleAgentStatus(agentId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsPending(false);
    }
  }

  async function onDelete() {
    setIsPending(true);
    try {
      const result = await deleteAgent(agentId);
      if (result.success) {
        toast.success(result.message);
        setShowDeleteAlert(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to delete agent");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(agentId)}
          >
            Copy Partner ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onToggleStatus} disabled={isPending}>
            <Power className="mr-2 h-4 w-4" />
            {isActive ? "Deactivate" : "Activate"} Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <AgentDetailDialog agent={agent} />
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <strong> {agentName}&apos;s</strong> account and remove their data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
