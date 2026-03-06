import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import User, { IMember } from "@/lib/db/models/User";
import { z } from "zod";

// Schema for a single member
const memberSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email().optional().or(z.literal("")),
    gender: z.enum(["male", "female", "other"]),
    age: z.number().min(0).max(120),
    aadhaarNumber: z
      .string()
      .regex(/^\d{12}$/, "Aadhaar must be 12 digits")
      .optional()
      .or(z.literal("")),
    passportNumber: z
      .string()
      .regex(
        /^[a-zA-Z0-9]{8}$/,
        "Passport must be exactly 8 alphanumeric characters",
      )
      .optional()
      .or(z.literal("")),
    documents: z.object({
      aadharCard: z.array(z.string()).optional().default([]),
      passport: z.array(z.string()).optional().default([]),
    }),
  })
  .superRefine((data, ctx) => {
    // Aadhaar sync
    if (
      (data.documents.aadharCard.length > 0 && !data.aadhaarNumber) ||
      (data.aadhaarNumber && data.documents.aadharCard.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Both Aadhar Number and Aadhar Card PDF are required together.",
        path: ["aadhaarNumber"],
      });
    }
  });

// GET — return all members for the current user
export async function GET() {
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

    await connectDB();
    const user = await User.findById(session.user.id).select("members").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ members: user.members || [] });
  } catch (error) {
    console.error("Members GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST — add a new member
export async function POST(request: Request) {
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

    const body = await request.json();
    const validation = memberSchema.safeParse(body);

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
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.members && user.members.length >= 30) {
      return NextResponse.json(
        { error: "Cannot exceed maximum of 30 members." },
        { status: 400 },
      );
    }

    const newMember = validation.data as IMember;
    user.members = user.members || [];
    user.members.push(newMember);
    await user.save();

    return NextResponse.json({
      message: "Member added successfully",
      members: user.members,
    });
  } catch (error) {
    console.error("Members POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT — update multiple members or replace entirely
const bulkMemberSchema = z
  .array(
    memberSchema.superRefine((data, ctx) => {
      // Aadhaar sync
      if (
        (data.documents.aadharCard.length > 0 && !data.aadhaarNumber) ||
        (data.aadhaarNumber && data.documents.aadharCard.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Both Aadhar Number and Aadhar Card PDF are required together.",
          path: ["aadhaarNumber"],
        });
      }
    }),
  )
  .max(30);

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = bulkMemberSchema.safeParse(body);

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
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { members: validation.data } },
      { new: true, runValidators: true },
    )
      .select("members")
      .lean();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Members updated successfully",
      members: updatedUser.members,
    });
  } catch (error) {
    console.error("Members PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
