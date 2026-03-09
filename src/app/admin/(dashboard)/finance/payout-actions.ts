"use server";

import { auth } from "@/lib/auth";
import PayoutRequest from "@/lib/db/models/PayoutRequest";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { sendPayoutStatusEmail } from "@/lib/email";
import { createBulkNotification } from "@/lib/notifications";
import { revalidatePath } from "next/cache";

export async function requestPayout(amount: number, agentNote?: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "agent") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const agent = await User.findById(session.user.id);
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    // Check if agent has bank details or UPI
    const hasBank = !!(agent.bankDetails?.accountNumber && agent.bankDetails?.ifscCode);
    const hasUPI = !!agent.upiId;

    if (!hasBank && !hasUPI) {
      return { success: false, error: "Please update your bank details or UPI ID in your profile first." };
    }

    // Determine payout method
    const payoutMethodType = hasBank ? "bank" : "upi";
    const payoutMethodDetails: any = hasBank ? {
      accountHolderName: agent.bankDetails?.accountHolderName,
      accountNumber: agent.bankDetails?.accountNumber,
      bankName: agent.bankDetails?.bankName,
      ifscCode: agent.bankDetails?.ifscCode,
      branchName: agent.bankDetails?.branchName,
    } : {
      upiId: agent.upiId,
    };

    // Always include UPI ID if they have it (even if bank is primary)
    if (hasBank && agent.upiId) {
      payoutMethodDetails.upiId = agent.upiId;
    }

    // Create payout request
    const newRequest = await PayoutRequest.create({
      agentId: agent._id,
      amount,
      agentNote,
      payoutMethod: {
        type: payoutMethodType,
        details: payoutMethodDetails,
      },
      status: "processing",
    });

    // Notify Admins
    const admins = await User.find({ role: "admin" }, "_id").lean();
    const adminIds = admins.map((admin: any) => admin._id.toString());
    
    if (adminIds.length > 0) {
      await createBulkNotification(adminIds, {
        title: "New Payout Request",
        message: `Agent ${agent.name} has requested a payout of ₹${amount.toLocaleString("en-IN")}.`,
        type: "info",
        link: "/admin/agents", // Payout requests tab is in Team Management for admins
      });
    }

    revalidatePath("/admin/finance");
    return { success: true, message: "Payout request submitted successfully." };
  } catch (error: any) {
    console.error("Payout request error:", error);
    return { success: false, error: error.message || "Failed to submit payout request" };
  }
}

export async function getPayoutRequests(role: "admin" | "agent") {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    let query = {};
    if (role === "agent") {
      query = { agentId: session.user.id };
    } else if (session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const requests = await PayoutRequest.find(query)
      .populate("agentId", "name email image")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(requests)) };
  } catch (error: any) {
    console.error("Get payout requests error:", error);
    return { success: false, error: "Failed to fetch payout requests" };
  }
}

export async function updatePayoutStatus(id: string, status: "processing" | "decline" | "Paid", adminNote?: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const updateData: any = { status, adminNote };
    if (status === "Paid") {
      updateData.processedAt = new Date();
    }

    const updated = await PayoutRequest.findByIdAndUpdate(id, updateData, { new: true }).populate("agentId");
    if (!updated) {
      return { success: false, error: "Payout request not found" };
    }

    // Send email notification to agent
    try {
      const agent = updated.agentId as any;
      if (agent && agent.email) {
        await sendPayoutStatusEmail({
          agentName: agent.name || "Agent",
          agentEmail: agent.email,
          amount: updated.amount,
          status: updated.status as "Paid" | "decline",
          adminNote: updated.adminNote,
        });
      }
    } catch (emailError) {
      console.error("Failed to send payout status email:", emailError);
      // Non-blocking error, allow the update to succeed
    }

    revalidatePath("/admin/agents");
    revalidatePath("/admin/finance");
    return { success: true, message: `Payout request marked as ${status}.` };
  } catch (error: any) {
    console.error("Update payout status error:", error);
    return { success: false, error: "Failed to update payout request status" };
  }
}
