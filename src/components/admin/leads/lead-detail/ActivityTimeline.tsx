import type { LeadActivityItem } from "@/app/admin/(dashboard)/leads/[id]/activity-actions";
import { format } from "date-fns";
import {
    AlertTriangle, ArrowRight, Clock, PlusCircle, UserMinus, UserPlus
} from "lucide-react";

interface ActivityTimelineProps {
  activities: LeadActivityItem[];
}

const ACTION_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    label: string;
  }
> = {
  created: {
    icon: PlusCircle,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
    label: "Lead Created",
  },
  stage_changed: {
    icon: ArrowRight,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    label: "Stage Changed",
  },
  agent_assigned: {
    icon: UserPlus,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
    label: "Agent Assigned",
  },
  agent_unassigned: {
    icon: UserMinus,
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
    label: "Agent Unassigned",
  },
  auto_abandon: {
    icon: AlertTriangle,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    label: "Auto-Abandoned",
  },
  abandon_recovered: {
    icon: ArrowRight,
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    label: "Recovered from Abandoned",
  },
  note_added: {
    icon: PlusCircle,
    color: "text-slate-600 bg-slate-100 dark:bg-slate-900/30",
    label: "Note Added",
  },
  details_updated: {
    icon: ArrowRight,
    color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30",
    label: "Details Updated",
  },
};

const DEFAULT_CONFIG = {
  icon: Clock,
  color: "text-slate-500 bg-slate-100 dark:bg-slate-800",
  label: "Activity",
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, index) => {
        const config = ACTION_CONFIG[activity.action] || DEFAULT_CONFIG;
        const Icon = config.icon;
        const isLast = index === activities.length - 1;

        return (
          <div key={activity._id} className="flex gap-3 relative">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-border" />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}
            >
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 pb-4 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">{config.label}</span>
                <span className="text-xs text-muted-foreground">
                  by {activity.userName}
                </span>
              </div>

              {activity.fromStage && activity.toStage && (
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <span className="px-1.5 py-0.5 rounded bg-muted capitalize">
                    {activity.fromStage.replace("_", " ")}
                  </span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="px-1.5 py-0.5 rounded bg-muted capitalize">
                    {activity.toStage.replace("_", " ")}
                  </span>
                </div>
              )}

              {activity.details && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {activity.details}
                </p>
              )}

              <p className="text-xs text-muted-foreground mt-0.5">
                {format(
                  new Date(activity.createdAt),
                  "MMM d, yyyy 'at' h:mm a",
                )}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
