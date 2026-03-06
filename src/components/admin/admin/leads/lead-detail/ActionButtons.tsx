"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  updateLeadStage,
  assignAgent,
  deleteLead,
} from "@/app/admin/(dashboard)/leads/actions";

interface Agent {
  _id: string;
  name: string;
}

interface ActionButtonsProps {
  leadId: string;
  currentStage: string;
  currentAgentId?: string;
  agents: Agent[];
  isAdmin: boolean;
}

const STAGES = [
  "new",
  "contacted",
  "booked",
  "proposal_sent",
  "negotiation",
  "dropped",
];

export function ActionButtons({
  leadId,
  currentStage,
  currentAgentId,
  agents,
  isAdmin,
}: ActionButtonsProps) {
  const router = useRouter();
  const [stage, setStage] = useState(currentStage);
  const [agentId, setAgentId] = useState(currentAgentId || "unassigned");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleStageChange(newStage: string) {
    setLoading(true);
    setStage(newStage);
    const result = await updateLeadStage(leadId, newStage);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
      setStage(currentStage); // Revert on error
    }
  }

  async function handleAgentChange(newAgentId: string) {
    setLoading(true);
    setAgentId(newAgentId);

    // Handle 'unassigned' case if logic supports it (currently schema allows optional agentId)
    // For now assuming we just switch between valid agents
    const result = await assignAgent(
      leadId,
      newAgentId === "unassigned" ? "" : newAgentId,
    );
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
      setAgentId(currentAgentId || "unassigned");
    }
  }

  async function handleDelete() {
    setDeleteLoading(true);
    const result = await deleteLead(leadId);

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/leads");
    } else {
      toast.error(result.error);
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Pipeline Stage</Label>
        <Select
          value={stage}
          onValueChange={handleStageChange}
          disabled={loading}
        >
          <SelectTrigger className="w-full capitalize">
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isAdmin && (
        <div className="space-y-2">
          <Label>Assigned Agent</Label>
          <Select
            value={agentId}
            onValueChange={handleAgentChange}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Assign agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="unassigned"
                className="text-muted-foreground italic"
              >
                Unassigned
              </SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent._id} value={agent._id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isAdmin && (
        <>
          <Separator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
                disabled={deleteLoading || loading}
              >
                {deleteLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete Lead
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  lead and remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
