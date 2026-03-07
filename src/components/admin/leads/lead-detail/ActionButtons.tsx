"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trophy, AlertCircle, RefreshCw } from "lucide-react";

import {
  updateLeadStage,
  assignAgent,
  refreshLeadTimer,
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
  isReadyToWin: boolean;
  currentUserId: string;
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
  isReadyToWin,
  currentUserId,
}: ActionButtonsProps) {
  const router = useRouter();
  const [stage, setStage] = useState(currentStage);
  const [agentId, setAgentId] = useState(currentAgentId || "unassigned");
  const [loading, setLoading] = useState(false);

  const isWon = currentStage === "won";
  const isAbandoned = currentStage === "abandoned";

  async function handleStageChange(newStage: string) {
    if (newStage === currentStage) return;

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

  async function handleMarkAsWon() {
    if (!isReadyToWin) {
      toast.error(
        "Please ensure Trip Cost is set, all documents are uploaded, and the trip is Fully Paid.",
      );
      return;
    }

    setLoading(true);
    const result = await updateLeadStage(leadId, "won");
    setLoading(false);

    if (result.success) {
      toast.success("Congratulations! Lead marked as Won.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  async function handleAgentChange(newAgentId: string) {
    setLoading(true);
    setAgentId(newAgentId);

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

  return (
    <div className="space-y-6">
      {!isWon && !isAbandoned && (
        <div className="space-y-3">
          {/* Admin Self-Assignment Button */}
          {isAdmin && agentId !== currentUserId && (
            <Button
              className="w-full gap-2 h-11 bg-emerald-600 hover:bg-emerald-700 text-black shadow-lg font-semibold"
              onClick={() => handleAgentChange(currentUserId)}
              disabled={loading}
            >
              Assign to Me
            </Button>
          )}

          <Button
            className={cn(
              "w-full gap-2 h-11 text-base font-semibold transition-all",
              isReadyToWin
                ? "bg-emerald-600 hover:bg-emerald-700 text-black shadow-lg shadow-emerald-200 dark:shadow-none"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border-dashed border-2 border-slate-200 dark:border-slate-700",
            )}
            onClick={handleMarkAsWon}
            disabled={loading || isWon}
          >
            <Trophy
              className={cn(
                "h-5 w-5",
                isReadyToWin ? "animate-bounce" : "opacity-50",
              )}
            />
            Mark as Won
          </Button>

          {!isReadyToWin && (
            <div className="flex items-start gap-2 p-2.5 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
              <p className="text-[11px] leading-tight text-amber-700 dark:text-amber-400">
                To enable <strong>Won</strong>, ensure Trip Cost is set,
                Itinerary & Documents are uploaded, and the trip is{" "}
                <strong>Fully Paid</strong>.
              </p>
            </div>
          )}

          <div className="pt-2 border-t">
            <Button
              variant="outline"
              className="w-full h-9 text-xs"
              onClick={async () => {
                setLoading(true);
                const result = await refreshLeadTimer(leadId);
                setLoading(false);
                if (result.success) {
                  toast.success(result.message);
                } else {
                  toast.error(result.error);
                }
              }}
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Refresh 7-Day Timer
            </Button>
            <p className="text-[10px] text-muted-foreground mt-1.5 text-center px-2">
              Reset the auto-abandon countdown to prevent this lead from going
              abandoned.
            </p>
          </div>
        </div>
      )}

      {isAbandoned && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 text-center space-y-2">
          <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
            This Lead is Abandoned
          </p>
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            Change the pipeline stage below to revive it.
          </p>
        </div>
      )}

      {isWon && (
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-center space-y-2">
          <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <Trophy className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
            This Trip is Won!
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
            The customer is now a traveler.
          </p>
        </div>
      )}

      <div className="space-y-2 pt-2 border-t">
        <Label>Pipeline Stage</Label>
        <Select
          value={stage}
          onValueChange={handleStageChange}
          disabled={loading || isWon}
        >
          <SelectTrigger className="w-full capitalize bg-background">
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent position="popper">
            {STAGES.map((s) => (
              <SelectItem
                key={s}
                value={s}
                className="capitalize"
                disabled={s === "won"}
              >
                {s === "new"
                  ? "Inquiry Received"
                  : s === "contacted"
                    ? "Under Review"
                    : s === "proposal_sent"
                      ? "Proposal Ready"
                      : s === "negotiation"
                        ? "Finalizing"
                        : s.replace("_", " ")}
              </SelectItem>
            ))}
            {isWon && (
              <SelectItem value="won" className="capitalize">
                Trip Confirmed
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {isAdmin && (
        <div className="space-y-2 pt-4 border-t">
          <Label>Assigned Agent</Label>
          <Select
            value={agentId}
            onValueChange={handleAgentChange}
            disabled={loading}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Assign agent" />
            </SelectTrigger>
            <SelectContent position="popper">
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
    </div>
  );
}
