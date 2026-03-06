"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import { auth } from "@/lib/auth";
import { z } from "zod";

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

export async function updateTripDetails(leadId: string, formData: FormData) {
  await verifyAgentOrAdminSession();
  await connectDB();

  const lead = await Lead.findById(leadId);
  if (!lead) return { error: "Lead not found" };

  const inclusionsStr = (formData.get("inclusions") as string) || "";
  const exclusionsStr = (formData.get("exclusions") as string) || "";

  lead.inclusions = inclusionsStr
    .split("\n")
    .map((s: string) => s.trim())
    .filter(Boolean);
  lead.exclusions = exclusionsStr
    .split("\n")
    .map((s: string) => s.trim())
    .filter(Boolean);
  lead.hotelName = (formData.get("hotelName") as string) || undefined;

  const rating = formData.get("hotelRating");
  lead.hotelRating = rating ? Number(rating) : undefined;

  await lead.save();
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath(`/dashboard/bookings/${leadId}`);
  return { success: true };
}

// ============ BASIC TRIP DETAILS ============

const basicTripDetailsSchema = z.object({
  tripType: z.enum(["domestic", "international"], "Trip type is required"),
  departureCity: z.string().min(2, "Departure city required").max(100),
  destination: z.string().min(2, "Destination required").max(100),
  travelDate: z.string().min(1, "Travel date is required"),
  duration: z.string().min(1, "Duration is required"),
  guests: z.coerce.number().int().min(1).max(50),
  budget: z.coerce.number().min(1),
  specialRequests: z.string().max(500).optional().default(""),
});

export async function updateLeadBasicTripDetails(
  leadId: string,
  formData: FormData,
) {
  try {
    await verifyAgentOrAdminSession();
    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) return { error: "Lead not found" };

    const netAmountStr = formData.get("netAmount")?.toString();
    const tripProfitStr = formData.get("tripProfit")?.toString();

    const updates: Record<string, any> = {
      tripType: formData.get("tripType"),
      departureCity: formData.get("departureCity"),
      destination: formData.get("destination"),
      travelDate: formData.get("travelDate"),
      duration: formData.get("duration"),
      guests: formData.get("guests"),
      budget: Number(formData.get("budget")) || lead.budget,
      netAmount: netAmountStr ? Number(netAmountStr) : lead.netAmount || 0,
      tripProfit: tripProfitStr ? Number(tripProfitStr) : lead.tripProfit || 0,
      specialRequests:
        (formData.get("specialRequests") as string) || lead.specialRequests,
    };

    // Calculate dynamic cost
    updates.tripCost = (updates.netAmount || 0) + (updates.tripProfit || 0);

    const parsed = basicTripDetailsSchema.safeParse(updates);

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    Object.assign(lead, parsed.data);
    lead.netAmount = updates.netAmount;
    lead.tripCost = updates.tripCost;
    lead.tripProfit = updates.tripProfit;
    lead.lastActivityAt = new Date();

    await lead.save();
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath(`/dashboard/bookings/${leadId}`);

    return { success: true, message: "Trip details updated successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update trip details";
    return { error: message };
  }
}

export async function updateLeadItineraryPdf(
  leadId: string,
  itineraryPdfUrl: string,
) {
  try {
    await verifyAgentOrAdminSession();
    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) return { error: "Lead not found" };

    lead.itineraryPdfUrl = itineraryPdfUrl;
    lead.lastActivityAt = new Date();

    await lead.save();
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath(`/dashboard/bookings/${leadId}`);

    return { success: true, message: "Itinerary PDF updated successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update itinerary PDF";
    return { error: message };
  }
}

export async function updateLeadCostDetails(
  leadId: string,
  tripCost: number,
  tripProfit: number,
) {
  try {
    await verifyAgentOrAdminSession();
    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) return { error: "Lead not found" };

    lead.tripCost = tripCost;
    lead.tripProfit = tripProfit;
    lead.lastActivityAt = new Date();

    await lead.save();
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath(`/dashboard/bookings/${leadId}`);

    return { success: true, message: "Cost details updated successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update cost details";
    return { error: message };
  }
}

export async function addItineraryDay(leadId: string, formData: FormData) {
  // Skeleton implementation to fix build error
  return { error: "Not implemented yet." };
}

export async function removeItineraryDay(leadId: string, index: number) {
  // Skeleton implementation to fix build error
  return { error: "Not implemented yet." };
}
