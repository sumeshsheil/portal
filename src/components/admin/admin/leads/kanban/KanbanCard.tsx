"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { differenceInMinutes, format } from "date-fns";
import { Banknote, Calendar, CreditCard, MapPin, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { KanbanLead } from "./types";

interface KanbanCardProps {
  lead: KanbanLead;
}

export function KanbanCard({ lead }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: lead._id,
      data: { lead },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const isTerminal = ["won", "dropped", "abandoned"].includes(lead.stage);
  const updatedAt = new Date(lead.stageUpdatedAt || lead.updatedAt);
  const minutesInactive = differenceInMinutes(new Date(), updatedAt);
  const minutesLeft = Math.max(0, 10080 - minutesInactive); // 7 days * 24 * 60
  
  const isInactive = !isTerminal && minutesLeft <= 0;
  const isExpiringSoon = minutesLeft <= 2880; // 2 days in minutes

  const timeLeftLabel = minutesLeft >= 1440 
    ? `${Math.floor(minutesLeft / 1440)}d left`
    : minutesLeft >= 60 
      ? `${Math.floor(minutesLeft / 60)}h left`
      : `${minutesLeft}min left`;

  const hasPendingPayment = lead.bookingPayments?.some(p => p.status === "pending");

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-card p-3 rounded-lg border shadow-sm cursor-grab active:cursor-grabbing touch-none relative group hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 select-none",
        isDragging && "opacity-90 z-50 shadow-xl rotate-2 scale-105",
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-sm line-clamp-1">
          {lead.travelers?.[0]?.name || "Unknown"}
        </h4>
        <Link
          href={`/admin/leads/${lead._id}`}
          className="absolute inset-0 z-10"
          onClick={(e) => isDragging && e.preventDefault()}
        />
        {lead.tripType === "international" ? (
          <Badge
            variant="secondary"
            className="text-[10px] h-5 px-1 bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            Intl
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="text-[10px] h-5 px-1 bg-green-50 text-green-700 hover:bg-green-50"
          >
            Dom
          </Badge>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{lead.destination}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          <span>{lead.travelDate}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 font-medium text-emerald-600">
            <Banknote className="h-3 w-3" />₹
            {lead.budget >= 1000
              ? `${(lead.budget / 1000).toFixed(1)}k`
              : lead.budget}
          </div>
          <div className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            {lead.guests}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">
            {format(new Date(lead.createdAt), "MMM d")}
          </span>
          {!isTerminal && (
            <span
              className={cn(
                "px-2 py-1 rounded text-[11px] font-bold leading-none shadow-sm",
                isExpiringSoon
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  : "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              )}
            >
              {timeLeftLabel}
            </span>
          )}
          {hasPendingPayment && !isTerminal && (
            <span
              className="px-1.5 py-0.5 rounded text-[10px] font-bold leading-none bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1 shadow-sm"
              title="Payment Pending"
            >
              <CreditCard className="h-3 w-3" /> Payment Check
            </span>
          )}
        </div>

        {lead.agentId ? (
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[9px] bg-emerald-100 text-emerald-700">
              {lead.agentId.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-5 w-5 rounded-full border border-dashed flex items-center justify-center">
            <span className="text-[8px] text-muted-foreground">-</span>
          </div>
        )}
      </div>
    </div>
  );
}
