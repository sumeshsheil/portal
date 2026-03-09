"use server";

import { auth } from "@/lib/auth";
import LeadActivity from "@/lib/db/models/LeadActivity";
import { connectDB } from "@/lib/db/mongoose";
import mongoose from "mongoose";

export interface LeadActivityItem {
  _id: string;
  action: string;
  details?: string;
  fromStage?: string;
  toStage?: string;
  userName?: string;
  createdAt: string;
}

export async function getLeadActivities(
  leadId: string,
): Promise<LeadActivityItem[]> {
  const session = await auth();
  if (!session) return [];

  if (!mongoose.Types.ObjectId.isValid(leadId)) return [];

  await connectDB();

  const activities = await LeadActivity.find({ leadId })
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const serialized = JSON.parse(JSON.stringify(activities));

  return serialized.map(
    (activity: {
      _id: string;
      action: string;
      details?: string;
      fromStage?: string;
      toStage?: string;
      userId?: { name?: string };
      createdAt: string;
    }) => ({
      _id: activity._id,
      action: activity.action,
      details: activity.details,
      fromStage: activity.fromStage,
      toStage: activity.toStage,
      userName: activity.userId?.name || "System",
      createdAt: activity.createdAt,
    }),
  );
}
