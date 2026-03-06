"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { auth } from "@/lib/auth";

export async function submitSubscriptionRequest(
  planId: string,
  billingCycle: string,
  transactionId: string
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "agent") {
      return { success: false, error: "Unauthorized" };
    }

    if (!transactionId || transactionId.trim().length === 0) {
      return { success: false, error: "Transaction ID is required" };
    }

    await connectDB();

    const agentId = session.user.id;
    const agent = await User.findById(agentId);

    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    // Set status to pending. The admin will actually activate it and extend dates.
    agent.plan = planId as any;
    agent.subscriptionStatus = "pending";
    agent.transactionId = transactionId;
    agent.billingCycle = billingCycle as any;

    await agent.save();

    revalidatePath("/admin/subscription");

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting subscription request:", error);
    return { success: false, error: error.message || "Failed to submit request" };
  }
}
