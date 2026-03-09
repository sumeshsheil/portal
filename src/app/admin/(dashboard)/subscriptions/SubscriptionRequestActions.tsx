"use client";

import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateAgentSubscription } from "../agents/actions";

interface SubscriptionRequestActionsProps {
  agentId: string;
  plan: string;
  billingCycle: string;
}

export function SubscriptionRequestActions({ agentId, plan, billingCycle }: SubscriptionRequestActionsProps) {
  const [isPending, setIsPending] = useState<"approve" | "reject" | null>(null);

  const handleAction = async (action: "approve" | "reject") => {
    setIsPending(action);
    try {
      const status = action === "approve" ? "active" : "expired"; // "expired" or "free"? 
      // If rejected, maybe reset to free? 
      const result = await updateAgentSubscription(
        agentId, 
        status as any, 
        action === "approve" ? (plan as any) : "free",
        action === "approve" ? (billingCycle as any) : undefined
      );

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPending(null);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        disabled={!!isPending}
        onClick={() => handleAction("reject")}
      >
        {isPending === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
        Reject
      </Button>
      <Button
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
        disabled={!!isPending}
        onClick={() => handleAction("approve")}
      >
        {isPending === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
        Approve
      </Button>
    </div>
  );
}
