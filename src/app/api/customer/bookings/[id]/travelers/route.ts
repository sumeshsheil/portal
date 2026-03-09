import { auth } from "@/lib/auth";
import Lead from "@/lib/db/models/Lead";
import { connectDB } from "@/lib/db/mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

const addTravelerSchema = z.object({
  name: z.string().min(2).max(100),
  age: z.number().min(0).max(120),
  gender: z.enum(["male", "female", "other"]),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  memberId: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const isAuthorized =
      session &&
      (session.user.role === "customer" ||
        session.user.role === "agent" ||
        session.user.role === "admin");

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const validation = addTravelerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await connectDB();

    // 1. Find the booking (Lead) owned by this customer
    const lead = await Lead.findOne({
      _id: id,
      customerId: session.user.id,
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Booking not found or unauthorized" },
        { status: 404 },
      );
    }

    // 2. Validate if we can add more travelers
    if (lead.travelers.length >= lead.guests) {
      return NextResponse.json(
        { error: `This booking is limited to ${lead.guests} guests.` },
        { status: 400 },
      );
    }

    // 3. Prevent duplicate travelers
    const isDuplicate = lead.travelers.some((t) => {
      // Check by memberId if both have it
      if (
        validation.data.memberId &&
        t.memberId &&
        String(t.memberId) === String(validation.data.memberId)
      ) {
        return true;
      }

      // Fallback check: name (case-insensitive) + age + gender
      const nameMatch =
        t.name.toLowerCase().trim() ===
        validation.data.name.toLowerCase().trim();
      const ageMatch = Number(t.age) === Number(validation.data.age);
      const genderMatch = t.gender === validation.data.gender;

      return nameMatch && ageMatch && genderMatch;
    });

    if (isDuplicate) {
      return NextResponse.json(
        { error: "This person is already added to this booking." },
        { status: 400 },
      );
    }

    // Assumptions: handle empty strings for email/phone to satisfy possible Mongoose defaults
    lead.travelers.push({
      ...validation.data,
      email: validation.data.email || undefined,
      phone: validation.data.phone || undefined,
    });

    await lead.save();

    return NextResponse.json({
      success: true,
      message: "Traveler added successfully",
      travelers: lead.travelers,
    });
  } catch (error) {
    console.error("Add traveler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const name = searchParams.get("name");

    if (!memberId && !name) {
      return NextResponse.json(
        { error: "Member ID or Name is required" },
        { status: 400 },
      );
    }

    await connectDB();

    const lead = await Lead.findOne({
      _id: id,
      customerId: session.user.id,
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Booking not found or unauthorized" },
        { status: 404 },
      );
    }

    // Identify the traveler to remove
    let index = -1;
    if (memberId) {
      index = lead.travelers.findIndex((t) => t.memberId === memberId);
    } else if (name) {
      index = lead.travelers.findIndex((t) => t.name === name);
    }

    if (index === -1) {
      return NextResponse.json(
        { error: "Traveler not found" },
        { status: 404 },
      );
    }

    // Prevent removing the primary traveler (index 0)
    if (index === 0) {
      return NextResponse.json(
        { error: "Cannot remove the primary traveler." },
        { status: 400 },
      );
    }

    // Remove the traveler
    lead.travelers.splice(index, 1);
    await lead.save();

    return NextResponse.json({
      success: true,
      message: "Traveler removed successfully",
      travelers: lead.travelers,
    });
  } catch (error) {
    console.error("Remove traveler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
