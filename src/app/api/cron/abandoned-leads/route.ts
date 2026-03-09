import Lead from "@/lib/db/models/Lead";
import LeadActivity from "@/lib/db/models/LeadActivity";
import { connectDB } from "@/lib/db/mongoose";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure this route is not cached

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find leads that will become abandoned (we need their IDs for activity logging)
    const abandonedLeads = await Lead.find({
      stage: { $nin: ["won", "dropped", "abandoned"] },
      $or: [
        { stageUpdatedAt: { $lt: sevenDaysAgo } },
        { stageUpdatedAt: { $exists: false }, updatedAt: { $lt: sevenDaysAgo } },
        { stageUpdatedAt: null, updatedAt: { $lt: sevenDaysAgo } },
      ],
    })
      .select("_id stage")
      .lean();

    if (abandonedLeads.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No leads to mark as abandoned.",
        count: 0,
      });
    }

    const abandonedLeadIds = abandonedLeads.map((lead) => lead._id);

    // Bulk update to abandoned
    const result = await Lead.updateMany({ _id: { $in: abandonedLeadIds } }, [
      {
        $set: {
          previousStage: "$stage",
          stage: "abandoned",
        },
      },
    ]);

    // Log activity for each abandoned lead
    const activityDocs = abandonedLeads.map((lead) => ({
      leadId: lead._id,
      action: "auto_abandon" as const,
      fromStage: lead.stage,
      toStage: "abandoned",
      details: "Automatically marked as abandoned due to 7 days of inactivity",
    }));

    try {
      await LeadActivity.insertMany(activityDocs);
    } catch (activityError: unknown) {
      // Non-blocking: activity logging shouldn't fail the cron
      console.error(
        "Failed to log abandoned activities:",
        activityError instanceof Error ? activityError.message : activityError,
      );
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} leads to abandoned status.`,
      count: result.modifiedCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Cron job error";
    console.error("Cron job error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
