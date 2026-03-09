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
};

const STAGE_LABELS: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  proposal_sent: "Proposal",
  negotiation: "Negotiation",
  won: "Trip Confirmed",
  dropped: "Dropped",
  abandoned: "Abandoned",
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
          <Badge variant="secondary" className="text-xs h-5 px-1.5 font-normal">
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
          isOver && "bg-emerald-500/5 ring-2 ring-emerald-500/20 ring-inset",
        )}
      >
        {leads.map((lead) => (
          <KanbanCard key={lead._id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
