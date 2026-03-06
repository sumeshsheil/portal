import LeadActivity from "@/lib/db/models/LeadActivity";

type ActivityAction =
  | "created"
  | "stage_changed"
  | "agent_assigned"
  | "agent_unassigned"
  | "note_added"
  | "details_updated"
  | "auto_abandon"
  | "abandon_recovered";

interface LogActivityParams {
  leadId: string;
  userId?: string;
  action: ActivityAction;
  details?: string;
  fromStage?: string;
  toStage?: string;
}

/**
 * Logs an activity event for a lead.
 * Non-blocking — errors are logged but don't throw.
 */
export async function logLeadActivity(
  params: LogActivityParams,
): Promise<void> {
  try {
    await LeadActivity.create({
      leadId: params.leadId,
      userId: params.userId || undefined,
      action: params.action,
      details: params.details,
      fromStage: params.fromStage,
      toStage: params.toStage,
    });
  } catch (error: unknown) {
    // Non-blocking: log but don't throw — activity logging should never break lead operations
    console.error(
      "Failed to log lead activity:",
      error instanceof Error ? error.message : error,
    );
  }
}
