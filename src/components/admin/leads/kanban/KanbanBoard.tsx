"use client";

import { useState, useCallback, useEffect } from "react";
import { differenceInMinutes } from "date-fns";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core";
import { KanbanLead, LeadStage, LEAD_STAGES } from "./types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { toast } from "sonner";
import { updateLeadStage } from "@/app/admin/(dashboard)/leads/actions";

interface KanbanBoardProps {
  initialLeads: KanbanLead[];
}

export function KanbanBoard({ initialLeads }: KanbanBoardProps) {
  const [leads, setLeads] = useState<KanbanLead[]>(initialLeads);
  const [activeLead, setActiveLead] = useState<KanbanLead | null>(null);

  // Sync state with props when server data changes (e.g. search/filter)
  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  // Auto-abandon leads that expire while viewing the board
  useEffect(() => {
    const expiredLeads = leads.filter((lead) => {
      const isTerminal = ["won", "dropped", "abandoned"].includes(lead.stage);
      if (isTerminal) return false;
      
      const updatedAt = new Date(lead.stageUpdatedAt || lead.updatedAt);
      const minutesInactive = differenceInMinutes(new Date(), updatedAt);
      const minutesLeft = Math.max(0, 10080 - minutesInactive);
      
      return minutesLeft <= 0;
    });

    if (expiredLeads.length > 0) {
      setLeads((prev) => 
        prev.map(l => expiredLeads.some(el => el._id === l._id) ? { ...l, stage: "abandoned" } : l)
      );
      
      expiredLeads.forEach(async (lead) => {
        try {
          const res = await updateLeadStage(lead._id, "abandoned");
          if (res.success) {
            toast.info(`Auto-abandoned expired lead`);
          }
        } catch (error) {
          console.error("Failed to auto abandon", error);
        }
      });
    }
  }, [leads]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Require slight movement to start drag prevents accidental clicks
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find((l) => l._id === active.id);
    if (lead) setActiveLead(lead);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const newStage = over.id as LeadStage;

    const lead = leads.find((l) => l._id === leadId);
    if (!lead || lead.stage === newStage) return;

    if (newStage === "abandoned") {
      toast.error("Leads cannot be manually moved to Abandoned. This happens automatically after 7 days.");
      return;
    }

    // Optimistic Update
    setLeads((prev) =>
      prev.map((l) => (l._id === leadId ? { ...l, stage: newStage } : l)),
    );

    // Call Server Action
    // We don't block UI interactions, but we show loading state if needed
    // setIsUpdating(true);
    const response = await updateLeadStage(leadId, newStage);

    // setIsUpdating(false);

    if (!response.success) {
      toast.error(response.error || "Failed to update stage");
      // Revert optimism
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, stage: lead.stage } : l)),
      );
    } else {
      toast.success(`Moved to ${newStage.replace("_", " ")}`);
    }
  };

  const getLeadsByStage = useCallback(
    (stage: LeadStage) => leads.filter((l) => l.stage === stage),
    [leads],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin} // Smoother feel
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        data-lenis-prevent
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-4"
      >
        {LEAD_STAGES.map((stage) => (
          <KanbanColumn
            data-lenis-prevent
            key={stage}
            stage={stage}
            leads={getLeadsByStage(stage)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? <KanbanCard lead={activeLead} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
