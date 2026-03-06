"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import { auth } from "@/lib/auth";
import { sendPaymentStatusNotification } from "@/lib/email";

export async function verifyPayment(leadId: string, paymentId: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    await connectDB();
    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    const payment = (lead.bookingPayments as any).id(paymentId);
    if (!payment) throw new Error("Payment record not found");

    payment.status = "verified";
    payment.verifiedAt = new Date();
    payment.verifiedBy = session.user.id;

    const leadDoc = lead as any;

    // Trigger Lead Stage update if this is the first booking payment being verified
    if (payment.type === "booking" && !["booked", "proposal_sent", "negotiation", "won", "dropped", "abandoned"].includes(leadDoc.stage)) {
       leadDoc.stage = "booked";
       leadDoc.stageUpdatedAt = new Date();
    }
    
    // If all payments (booking + trip_cost) are verified, mark as paid? 
    const allVerifiedAmount = leadDoc.bookingPayments
      .filter((p: any) => p.status === "verified")
      .reduce((sum: number, p: any) => sum + p.amount, 0);
    
    if (leadDoc.tripCost && allVerifiedAmount >= leadDoc.tripCost) {
      leadDoc.paymentStatus = "paid";
    }

    await leadDoc.save();

    // Send email notification
    await sendPaymentStatusNotification({
      to: leadDoc.email || (leadDoc.travelers?.[0]?.email),
      name: leadDoc.travelers?.[0]?.name || leadDoc.name,
      amount: payment.amount,
      status: "verified",
      transactionId: payment.transactionId,
      type: payment.type,
      destination: lead.destination
    });

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath(`/admin/leads`);
    
    return { success: true, message: "Payment verified successfully" };
  } catch (error: any) {
    console.error("Verify Payment Error:", error);
    return { success: false, error: error.message || "Failed to verify payment" };
  }
}

export async function rejectPayment(leadId: string, paymentId: string, reason: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    await connectDB();
    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error("Lead not found");

    const payment = (lead.bookingPayments as any).id(paymentId);
    if (!payment) throw new Error("Payment record not found");

    payment.status = "rejected";
    payment.rejectionReason = reason;

    const leadDoc = lead as any;
    await leadDoc.save();

    // Send email notification
    await sendPaymentStatusNotification({
      to: leadDoc.email || (leadDoc.travelers?.[0]?.email),
      name: leadDoc.travelers?.[0]?.name || leadDoc.name,
      amount: payment.amount,
      status: "rejected",
      transactionId: payment.transactionId,
      type: payment.type,
      destination: leadDoc.destination,
      rejectionReason: reason
    });

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, message: "Payment rejected" };
  } catch (error: any) {
    console.error("Reject Payment Error:", error);
    return { success: false, error: error.message || "Failed to reject payment" };
  }
}
