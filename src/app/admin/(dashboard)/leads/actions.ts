"use server";

import { auth } from "@/lib/auth";
import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { sendLeadAssignmentEmail, sendBookingConfirmedEmail } from "@/lib/email";
import { logLeadActivity } from "@/lib/lead-activity";
import { createNotification } from "@/lib/notifications";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ============ AUTH HELPER ============

async function verifySession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ============ VALIDATION SCHEMAS ============

const createLeadSchema = z.object({
  tripType: z.enum(["domestic", "international"], "Trip type is required"),
  departureCity: z
    .string()
    .min(2, "Departure city must be at least 2 characters")
    .max(100),
  destination: z
    .string()
    .min(2, "Destination must be at least 2 characters")
    .max(100),
  travelDate: z.string().min(1, "Travel date is required"),
  duration: z.string().min(1, "Duration is required"),
  guests: z.coerce
    .number()
    .int()
    .min(1, "At least 1 guest required")
    .max(50, "Maximum 50 guests"),
  budget: z.coerce.number().min(1, "Budget must be at least 1"),
  specialRequests: z.string().max(500).optional().default(""),
  customerId: z.string().min(1, "Customer selection is required"),
});

// ============ SERVER ACTIONS ============

export async function createLead(prevState: unknown, formData: FormData) {
  try {
    const session = await verifySession();
    await connectDB();

    if (session.user.role !== "admin") {
      return {
        success: false,
        error: "Only administrators can create manual inquiries.",
      };
    }

    // Extract raw form data
    const rawData = {
      tripType: formData.get("tripType"),
      departureCity: formData.get("departureCity"),
      destination: formData.get("destination"),
      travelDate: formData.get("travelDate"),
      duration: formData.get("duration"),
      guests: formData.get("guests"),
      budget: formData.get("budget"),
      specialRequests: formData.get("specialRequests") || "",
      customerId: formData.get("customerId"),
    };

    // Validate with Zod
    const validation = createLeadSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0];
      return {
        success: false,
        error: firstError || "Validation failed. Please check your inputs.",
        fieldErrors,
      };
    }

    const validated = validation.data;
    let travelers: any[] = [];
    let isPlatformUser = false;
    let isContact = false;

    if (validated.customerId) {
        // First try to find a platform User
        let customer = await User.findById(validated.customerId).lean();
        
        if (customer) {
            isPlatformUser = true;
            // Populate primary traveler from User data
            travelers = [
                {
                    name: customer.name || "Unknown",
                    email: customer.email,
                    phone: customer.phone,
                    age: (customer as any).age || 30, // Default age if not set
                    gender: (customer as any).gender || "other",
                },
            ];
        } else {
            // If not found in User, try Contact collection
            // We import Contact dynamically to avoid circular dependencies if any
            const Contact = mongoose.models.Contact || mongoose.model("Contact");
            let contact = await Contact.findById(validated.customerId).lean();
            if (contact) {
                isContact = true;
                travelers = [
                {
                    name: contact.name || "Unknown",
                    email: contact.email,
                    phone: contact.phone,
                    age: 30, // Default age
                    gender: "other", // Default gender
                },
                ];
            } else {
                return { success: false, error: "Customer/Contact not found" };
            }
        }
    } else {
       return {
          success: false,
          error: "Customer or Contact ID is required",
        };
    }

    // Build lead document
    const leadData = {
      tripType: validated.tripType,
      departureCity: validated.departureCity,
      destination: validated.destination,
      travelDate: validated.travelDate,
      duration: validated.duration,
      guests: validated.guests,
      budget: validated.budget,
      specialRequests: validated.specialRequests,
      customerId: isPlatformUser ? validated.customerId : undefined,
      contactId: isContact ? validated.customerId : undefined,
      travelers: travelers.map((t: any) => ({
        name: t.name,
        email: t.email || undefined,
        phone: t.phone || undefined,
        age: Number(t.age) || 30,
        gender: t.gender || "other",
        aadhaarNumber: t.aadhaarNumber || undefined,
        panNumber: t.panNumber || undefined,
        documents: {
          aadharCard: Array.isArray(t.aadharCard) ? t.aadharCard : [],
          panCard: Array.isArray(t.panCard) ? t.panCard : [],
          passport: Array.isArray(t.passport) ? t.passport : [],
        },
      })),
      source: "manual" as const,
      agentId: undefined, // Manual inquiries by admins are unassigned by default
      lastActivityAt: new Date(),
    };
    const newLead = await Lead.create(leadData);

    // Log activity
    await logLeadActivity({
      leadId: newLead._id.toString(),
      userId: session.user.id,
      action: "created",
      details: `Manual lead created for ${travelers[0].name} + ${travelers.length - 1} others`,
    });

    revalidatePath("/admin/leads");
    return {
      success: true,
      message: "Lead created successfully",
      leadId: newLead._id.toString(),
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create lead";
    console.error("Create lead error:", message);
    return { success: false, error: message };
  }
}

export async function updateLeadStage(leadId: string, newStage: string) {
  try {
    await verifySession();
    await connectDB();

    // Validate leadId format
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    // Validate stage value
    const validStages = [
      "new",
      "contacted",
      "booked",
      "proposal_sent",
      "negotiation",
      "won",
      "dropped",
      "abandoned",
    ];
    if (!validStages.includes(newStage)) {
      return { success: false, error: "Invalid stage value" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    // Prevent changing stage if lead is already won (except maybe by super admin if ever implemented)
    if (lead.stage === "won" && newStage !== "won") {
      return {
        success: false,
        error: "Confirmed trips cannot be moved back to other stages.",
      };
    }

    // === BUSINESS LOGIC CONSTRAINTS FOR 'WON' STAGE ===
    if (newStage === "won") {
      // 1. Check Trip Cost
      if (!lead.tripCost || lead.tripCost <= 0) {
        return {
          success: false,
          error: "Trip Cost must be set before marking as Won.",
        };
      }

      // 2. Check Itinerary (either PDF or list)
      const hasItinerary =
        (lead.itinerary && lead.itinerary.length > 0) || lead.itineraryPdfUrl;
      if (!hasItinerary) {
        return {
          success: false,
          error: "Trip Itinerary must be uploaded before marking as Won.",
        };
      }

      // 3. Check Travel Documents (either PDF or list)
      const hasDocuments =
        (lead.documents && lead.documents.length > 0) ||
        lead.travelDocumentsPdfUrl;
      if (!hasDocuments) {
        return {
          success: false,
          error:
            "Travel Documents/Tickets must be uploaded before marking as Won.",
        };
      }

      // 4. Check Payment Status
      if (lead.paymentStatus !== "paid") {
        return {
          success: false,
          error: "The trip must be fully paid before it can be marked as Won.",
        };
      }
    }

    const previousStage = lead.stage;
    lead.previousStage = lead.stage;
    lead.stage = newStage as typeof lead.stage;
    lead.lastActivityAt = new Date();
    lead.stageUpdatedAt = new Date();
    await lead.save();

    // Trigger automated email if stage changed to 'won'
    if (newStage === "won" && previousStage !== "won") {
      const customerEmail = lead.travelers?.[0]?.email;
      const customerName = lead.travelers?.[0]?.name;
      if (customerEmail) {
        try {
          await sendBookingConfirmedEmail({
            name: customerName || "Traveler",
            email: customerEmail,
            destination: lead.destination,
          });
        } catch (emailError) {
          console.error("Failed to send booking confirmation email:", emailError);
          // We don't fail the whole action if just the email fails, but we log it
        }
      }
    }

    // Log activity
    const session = await auth();
    await logLeadActivity({
      leadId,
      userId: session?.user?.id,
      action: newStage === "abandoned" ? "auto_abandon" : "stage_changed",
      fromStage: previousStage,
      toStage: newStage,
      details: `Stage changed from ${previousStage} to ${newStage}`,
    });

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);

    return { success: true, message: `Stage updated to ${newStage}` };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update stage";
    return { success: false, error: message };
  }
}

export async function assignAgent(leadId: string, agentId: string) {
  try {
    const session = await verifySession();

    // Only admins can assign agents or themselves to leads
    if (session.user.role !== "admin") {
      return {
        success: false,
        error: "Unauthorized: Only administrators can assign leads",
      };
    }

    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    if (lead.stage === "won") {
      return {
        success: false,
        error: "Cannot change agent for a confirmed trip.",
      };
    }

    // Validate leadId
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    // Handle unassigning: if agentId is empty/unassigned, set to null
    const isUnassigning =
      !agentId || agentId === "unassigned" || agentId === "";

    let targetUser: any = null;

    if (!isUnassigning) {
      if (!mongoose.Types.ObjectId.isValid(agentId)) {
        return { success: false, error: "Invalid agent ID" };
      }

      // Ensure the target is an agent or an admin
      targetUser = await User.findById(agentId);
      if (!targetUser || !["agent", "admin"].includes(targetUser.role)) {
        return {
          success: false,
          error: "Target user must be an agent or admin",
        };
      }

      if (targetUser.role === "agent" && !targetUser.isVerified) {
        return {
          success: false,
          error: "Only verified agents can be assigned to leads.",
        };
      }
    }

    await Lead.findByIdAndUpdate(leadId, {
      agentId: isUnassigning ? null : new mongoose.Types.ObjectId(agentId),
      lastActivityAt: new Date(),
    });

    // Log activity
    await logLeadActivity({
      leadId,
      userId: session.user.id,
      action: isUnassigning ? "agent_unassigned" : "agent_assigned",
      details: isUnassigning
        ? "Agent unassigned from lead"
        : `Agent ${agentId} assigned to lead`,
    });

    // Notify agent if assigned
    if (!isUnassigning) {
      await createNotification({
        userId: agentId,
        title: "New Lead Assigned",
        message: "You have been assigned a new lead.",
        type: "info",
        link: `/admin/leads/${leadId}`,
      });

      // Send Email Notification
      await sendLeadAssignmentEmail({
        agentName: targetUser!.name,
        agentEmail: targetUser!.email,
        leadCount: 1,
        leadUrl: `${process.env.NEXTAUTH_URL}/admin/leads/${leadId}`,
      });
    }

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);

    return {
      success: true,
      message: isUnassigning
        ? "Agent unassigned successfully"
        : "Agent assigned successfully",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to assign agent";
    return { success: false, error: message };
  }
}

export async function deleteLead(leadId: string) {
  try {
    const session = await verifySession();
    if (session.user.role !== "admin") {
      return { success: false, error: "Only admins can delete leads" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return { success: false, error: "Lead not found" };
    }

    if (lead.stage === "won") {
      return { success: false, error: "Cannot delete a lead that has been marked as Won." };
    }

    await Lead.findByIdAndDelete(leadId);

    revalidatePath("/admin/leads");
    return { success: true, message: "Lead deleted successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete lead";
    return { success: false, error: message };
  }
}

export async function bulkAssignAgents(leadIds: string[], agentId: string) {
  try {
    const session = await verifySession();
    if (session.user.role !== "admin") {
      return { success: false, error: "Only admins can perform bulk actions" };
    }

    if (!leadIds || leadIds.length === 0) {
      return { success: false, error: "No leads selected" };
    }

    await connectDB();

    const isUnassigning =
      !agentId || agentId === "unassigned" || agentId === "";

    let targetAgent: any = null;

    if (!isUnassigning) {
      if (!mongoose.Types.ObjectId.isValid(agentId)) {
        return { success: false, error: "Invalid agent ID" };
      }

      targetAgent = await User.findById(agentId);
      if (!targetAgent || targetAgent.role !== "agent") {
        return { success: false, error: "Target user is not an agent" };
      }

      if (!targetAgent.isVerified) {
        return {
          success: false,
          error: "Only verified agents can be assigned to leads.",
        };
      }
    }

    const objectLeadIds = leadIds.map((id) => new mongoose.Types.ObjectId(id));

    // Filter out won leads to prevent reassignment
    const leadsToUpdate = await Lead.find({
      _id: { $in: objectLeadIds },
      stage: { $ne: "won" },
    });

    if (leadsToUpdate.length === 0) {
      return {
        success: false,
        error:
          "No assignable leads selected (confirmed trips cannot be reassigned)",
      };
    }

    const filteredLeadIds = leadsToUpdate.map((l) => l._id);

    await Lead.updateMany(
      { _id: { $in: filteredLeadIds } },
      {
        agentId: isUnassigning ? null : new mongoose.Types.ObjectId(agentId),
        lastActivityAt: new Date(),
      },
    );

    // Log activity for each lead
    for (const leadId of filteredLeadIds) {
      await logLeadActivity({
        leadId: leadId.toString(),
        userId: session.user.id,
        action: isUnassigning ? "agent_unassigned" : "agent_assigned",
        details: isUnassigning
          ? "Agent unassigned from lead (Bulk Action)"
          : `Agent ${agentId} assigned to lead (Bulk Action)`,
      });
    }

    // Notify agent once if assigned
    if (!isUnassigning) {
      await createNotification({
        userId: agentId,
        title: "Bulk Leads Assigned",
        message: `You have been assigned ${leadIds.length} new leads.`,
        type: "info",
        link: `/admin/leads`,
      });

      // Send Email Notification
      await sendLeadAssignmentEmail({
        agentName: targetAgent!.name,
        agentEmail: targetAgent!.email,
        leadCount: leadIds.length,
        leadUrl: `${process.env.NEXTAUTH_URL}/admin/leads`,
      });
    }

    revalidatePath("/admin/leads");
    return {
      success: true,
      message: `${leadIds.length} leads ${isUnassigning ? "unassigned" : "assigned"} successfully`,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to perform bulk assignment";
    return { success: false, error: message };
  }
}

export async function refreshLeadTimer(leadId: string) {
  try {
    await verifySession();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    if (lead.stage === "won") {
      return { success: false, error: "Cannot edit a lead that has been marked as Won." };
    }

    lead.stageUpdatedAt = new Date();
    lead.lastActivityAt = new Date();
    await lead.save();

    const session = await auth();
    await logLeadActivity({
      leadId,
      userId: session?.user?.id,
      action: "details_updated",
      details:
        "Lead timer refreshed. The 7-day auto-abandon limit has been reset.",
    });

    revalidatePath(`/admin/leads/${leadId}`);

    return { success: true, message: "Lead timer refreshed." };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to refresh timer";
    return { success: false, error: message };
  }
}

export async function addLeadComment(leadId: string, text: string) {
  try {
    const session = await verifySession();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { success: false, error: "Invalid lead ID" };
    }

    if (!text || text.trim().length === 0) {
      return { success: false, error: "Comment text cannot be empty" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    if (lead.stage === "won") {
      return { success: false, error: "Cannot add comments to a confirmed trip." };
    }

    // Prevent previous agents from commenting if reassigned
    if (
      session.user.role === "agent" &&
      lead.agentId &&
      lead.agentId.toString() !== session.user.id
    ) {
      return {
        success: false,
        error: "You are no longer assigned to this lead.",
      };
    }

    lead.comments = lead.comments || [];
    lead.comments.push({
      text: text.trim(),
      agentName: session.user.name || "Unknown Agent",
      agentId: new mongoose.Types.ObjectId(session.user.id),
      createdAt: new Date(),
    });

    lead.lastActivityAt = new Date();
    await lead.save();

    await logLeadActivity({
      leadId,
      userId: session.user.id,
      action: "note_added",
      details: "Added a new comment.",
    });

    revalidatePath(`/admin/leads/${leadId}`);

    return { success: true, message: "Comment added successfully." };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to add comment";
    return { success: false, error: message };
  }
}

export async function updateLeadComment(
  leadId: string,
  commentId: string,
  text: string,
) {
  try {
    await verifySession();
    await connectDB();

    if (
      !mongoose.Types.ObjectId.isValid(leadId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return { success: false, error: "Invalid IDs" };
    }

    if (!text || text.trim().length === 0) {
      return { success: false, error: "Comment text cannot be empty" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    if (lead.stage === "won") {
      return { success: false, error: "Cannot edit comments on a confirmed trip." };
    }

    const comment = (lead.comments as any[]).find(
      (c) => c._id.toString() === commentId,
    );
    if (!comment) return { success: false, error: "Comment not found" };

    comment.text = text.trim();
    lead.lastActivityAt = new Date();
    await lead.save();

    revalidatePath(`/admin/leads/${leadId}`);

    return { success: true, message: "Comment updated successfully." };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update comment";
    return { success: false, error: message };
  }
}

export async function deleteLeadComment(leadId: string, commentId: string) {
  try {
    await verifySession();
    await connectDB();

    if (
      !mongoose.Types.ObjectId.isValid(leadId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return { success: false, error: "Invalid IDs" };
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return { success: false, error: "Lead not found" };

    if (lead.stage === "won") {
      return { success: false, error: "Cannot delete comments from a confirmed trip." };
    }

    lead.comments = (lead.comments as any[]).filter(
      (c) => c._id.toString() !== commentId,
    );

    lead.lastActivityAt = new Date();
    await lead.save();

    revalidatePath(`/admin/leads/${leadId}`);

    return { success: true, message: "Comment deleted successfully." };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete comment";
    return { success: false, error: message };
  }
}

export async function getCustomers(search: string = "") {
  try {
    const session = await verifySession();
    await connectDB();

    if (session.user.role === "admin") {
        // Admins see all platform users
        const query: any = { role: "customer" };
        if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
        }

        const customers = await User.find(query)
        .select("_id name email phone")
        .sort({ name: 1 })
        .limit(10)
        .lean();

        return {
        success: true,
        customers: JSON.parse(JSON.stringify(customers)),
        };
    } else {
        // Agents see their address book contacts
        // We import Contact dynamically to avoid circular deps
        const Contact = mongoose.models.Contact || mongoose.model("Contact");
        const query: any = { agentId: session.user.id };
        if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
        }

        const contacts = await Contact.find(query)
        .select("_id name email phone")
        .sort({ name: 1 })
        .limit(10)
        .lean();

        return {
        success: true,
        customers: JSON.parse(JSON.stringify(contacts)),
        };
    }
  } catch (error) {
    console.error("Get customers/contacts error:", error);
    return { success: false, error: "Failed to fetch customers from your contacts list" };
  }
}
