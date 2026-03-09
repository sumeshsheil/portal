"use server";

import { auth } from "@/lib/auth";
import Lead from "@/lib/db/models/Lead";
import { connectDB } from "@/lib/db/mongoose";
import { sendTravelDocumentEmail } from "@/lib/email";
import { deleteFileFromImageKit } from "@/lib/imagekit";
import { revalidatePath } from "next/cache";

// ============ AUTH HELPER ============

async function verifyAgentOrAdminSession() {
  const session = await auth();
  if (
    !session?.user?.id ||
    (session.user.role !== "admin" && session.user.role !== "agent")
  ) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ============ DOCUMENT ACTIONS ============

export async function updateLeadTravelDocumentsPdf(
  leadId: string,
  travelDocumentsPdfUrl: string,
) {
  try {
    await verifyAgentOrAdminSession();
    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) return { error: "Lead not found" };

    if (lead.stage === "won") {
      return { error: "Cannot edit a lead that has been marked as Won." };
    }

    const oldUrl = lead.travelDocumentsPdfUrl;
    lead.travelDocumentsPdfUrl = travelDocumentsPdfUrl;
    lead.lastActivityAt = new Date();

    await lead.save();

    // Delete old file if it exists and is different
    if (oldUrl && oldUrl !== travelDocumentsPdfUrl) {

      await deleteFileFromImageKit(oldUrl);
    }

    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath(`/dashboard/bookings/${leadId}`);

    // Send email to customer if it's an upload (not a removal)
    if (travelDocumentsPdfUrl && oldUrl !== travelDocumentsPdfUrl) {
      const primaryTraveler = lead.travelers?.[0];
      if (primaryTraveler && primaryTraveler.email) {
        // Run asynchronously so it doesn't block the UI response
        sendTravelDocumentEmail({
          to: primaryTraveler.email,
          name: primaryTraveler.name || "Customer",
          destination: lead.destination || "your destination",
          pdfUrl: travelDocumentsPdfUrl,
        }).catch(err => console.error("Failed to send document email:", err));
      }
    }

    return {
      success: true,
      message: "Travel documents PDF updated successfully",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update travel documents PDF";
    return { error: message };
  }
}

export async function addDocument(leadId: string, formData: FormData) {
  try {
    await verifyAgentOrAdminSession();
    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) return { error: "Lead not found" };

    if (lead.stage === "won") {
      return { error: "Cannot add documents to a confirmed trip." };
    }

    const name = formData.get("name")?.toString();
    const url = formData.get("url")?.toString();
    const type = formData.get("type")?.toString();

    if (!name || !url || !type) {
      return { error: "Missing document details" };
    }

    lead.documents = lead.documents || [];
    lead.documents.push({
      name,
      url,
      type: type as any,
      uploadedAt: new Date(),
    });

    lead.lastActivityAt = new Date();
    await lead.save();

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, message: "Document added successfully" };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Failed to add document" };
  }
}

export async function removeDocument(leadId: string, index: number) {
  try {
    await verifyAgentOrAdminSession();
    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) return { error: "Lead not found" };

    if (lead.stage === "won") {
      return { error: "Cannot remove documents from a confirmed trip." };
    }

    if (!lead.documents || !lead.documents[index]) {
      return { error: "Document not found" };
    }

    const doc = lead.documents[index];
    
    // Delete from ImageKit

    await deleteFileFromImageKit(doc.url);

    // Remove from array
    lead.documents.splice(index, 1);
    
    lead.lastActivityAt = new Date();
    await lead.save();

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, message: "Document removed successfully" };
  } catch (error: unknown) {
    return { error: error instanceof Error ? error.message : "Failed to remove document" };
  }
}
