"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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
    <div className={cn(
      "flex flex-col h-[600px] w-full transition-all",
      stage === "marketing_ads" 
        ? "bg-transparent border-none shadow-none" 
        : "bg-muted/40 rounded-xl border border-border/50 shadow-sm hover:bg-muted/60"
    )}>
      {/* Header */}
      {stage !== "marketing_ads" && (
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
      )}

      {/* Cards Area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 overflow-y-auto scrollbar-hide min-h-[150px] transition-colors",
          isOver && stage !== "marketing_ads" && "bg-emerald-500/5 ring-2 ring-emerald-500/20 ring-inset",
        )}
      >
        {stage === "marketing_ads" ? (
          <div className="group relative h-full flex flex-col items-center justify-between p-8 overflow-hidden rounded-2xl border border-purple-500/20 bg-linear-to-b from-purple-500/10 to-transparent backdrop-blur-md transition-all duration-700 hover:border-purple-500/40 hover:shadow-[0_0_50px_-10px_rgba(168,85,247,0.4)]">
            {/* Animated Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-700" />
            
            <div className="flex flex-col items-center space-y-6 z-10 py-4">
              <div className="relative">
                <div className="p-6 bg-purple-500/20 rounded-3xl ring-1 ring-purple-500/30 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                  <span className="text-5xl filter drop-shadow-lg">💎</span>
                </div>
                {/* Pulsing "Live" indicator */}
                <div className="absolute -top-2 -right-2 flex items-center gap-1.5 bg-background/90 backdrop-blur-xl border border-emerald-500/40 px-3 py-1 rounded-full shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Live Now</span>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <h4 className="font-extrabold text-2xl tracking-tight bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-indigo-400 dark:to-purple-400">
                  The Enterprise Experience
                </h4>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-80">
                  Unlock Hyper-Growth Potential
                </p>
              </div>
            </div>

            <div className="w-full space-y-4 z-10 pb-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50 border border-border/50 transition-all duration-300 hover:bg-background/80 hover:translate-x-1">
                  <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 2 22 6 18 10"/><path d="M8 3.91 9 4c.7.08 1.3.49 1.5 1.1l.8 2.4c.15.44.1.91-.15 1.3L10 10c-1.1 1.1.7 5.1 3.1 7.1l.3-.3c.4-.4.9-.5 1.4-.4l2.4.8c.6.2 1 .8 1.1 1.5l.09 1c.01.62-.48 1.15-1.1 1.1-7.74-.46-13.84-6.56-14.3-14.3-.05-.62.48-1.11 1.1-1.1Z"/><line x1="14" x2="22" y1="6" y2="6"/></svg>
                  </div>
                  <span className="text-sm font-bold text-foreground/90">Live Customer Connect</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50 border border-border/50 transition-all duration-300 hover:bg-background/80 hover:translate-x-1">
                  <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <span className="text-sm font-bold text-foreground/90">Priority Traffic Access</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50 border border-border/50 transition-all duration-300 hover:bg-background/80 hover:translate-x-1">
                  <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <span className="text-sm font-bold text-foreground/90">Premium Trust Badge</span>
                </div>
              </div>

              <Link 
                href="/admin/subscription#enterprise-plan"
                className="w-full py-4 mt-2 bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 bg-size-[200%_auto] hover:bg-pos-[right_center] text-white rounded-2xl text-sm font-black transition-all duration-500 shadow-xl shadow-purple-500/30 active:scale-[0.97] group-hover:scale-[1.02] flex items-center justify-center"
              >
                Inquire for Access
              </Link>
            </div>
          </div>
        ) : (
          leads.map((lead) => <KanbanCard key={lead._id} lead={lead} />)
        )}
      </div>
    </div>
  );
}
