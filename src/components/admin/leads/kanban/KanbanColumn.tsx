"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./KanbanCard";
import { KanbanLead, LeadStage } from "./types";

interface KanbanColumnProps {
  stage: LeadStage;
  leads: KanbanLead[];
}

const STAGE_COLORS: Record<LeadStage, string> = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  booked: "bg-emerald-500",
  proposal_sent: "bg-indigo-500",
  negotiation: "bg-orange-500",
  won: "bg-emerald-600",
  dropped: "bg-red-500",
  abandoned: "bg-gray-500",
  marketing_ads: "bg-purple-500",
};

const STAGE_LABELS: Record<LeadStage, string> = {
  new: "Inquiry Received",
  contacted: "Under Review",
  booked: "Booked",
  proposal_sent: "Proposal Ready",
  negotiation: "Finalizing",
  won: "Trip Confirmed",
  dropped: "Dropped",
  abandoned: "Abandoned",
  marketing_ads: "Marketing Ads",
};

export function KanbanColumn({ stage, leads }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  const totalValue = leads.reduce((sum, lead) => sum + lead.budget, 0);

  return (
    <div className="flex flex-col h-[600px] w-full bg-muted/40 rounded-xl border border-border/50 shadow-sm transition-all hover:bg-muted/60">
      {/* Header */}
      <div className="p-3 border-b bg-background/50 rounded-t-xl backdrop-blur-sm sticky top-0 z-10 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn("h-2.5 w-2.5 rounded-full", STAGE_COLORS[stage])}
            />
            <h3 className="font-semibold text-sm">{STAGE_LABELS[stage]}</h3>
          </div>
          <Badge className="bg-red-700 hover:bg-red-800 text-white text-xs font-bold h-6 w-6 flex items-center justify-center p-0 rounded-full border-none shadow-sm shrink-0">
            {leads.length}
          </Badge>
        </div>
        <div className="text-[10px] text-muted-foreground font-medium pl-4.5">
          Total: ${totalValue.toLocaleString()}
        </div>
      </div>

      {/* Cards Area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 overflow-y-auto scrollbar-hide min-h-[150px] transition-colors",
          isOver && stage !== "marketing_ads" && "bg-emerald-500/5 ring-2 ring-emerald-500/20 ring-inset",
        )}
      >
        {stage === "marketing_ads" ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-background/40 rounded-lg border border-dashed border-purple-500/30">
            <div className="p-3 bg-purple-500/10 rounded-full">
              <span className="text-2xl">🚀</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-purple-600 dark:text-purple-400">
                Enterprise Plan
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Check out our Enterprise plan to earn more and grow your business.
              </p>
            </div>
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-500/20 active:scale-95">
              Learn More
            </button>
          </div>
        ) : (
          leads.map((lead) => <KanbanCard key={lead._id} lead={lead} />)
        )}
      </div>
    </div>
  );
}
