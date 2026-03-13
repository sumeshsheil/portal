import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { sendAgentVerificationNotification } from "@/lib/email";
import { createBulkNotification } from "@/lib/notifications";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const onboardingSchema = z.object({
  token: z.string().min(1, "Token is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z
    .any()
    .refine((val) => ["male", "female", "other"].includes(String(val)), {
      message: "Please select a valid gender option",
    }),
  age: z
    .any()
    .refine(
      (val) => {
        const num = parseInt(String(val || ""), 10);
        return !isNaN(num) && num >= 18 && num <= 120;
      },
      {
        message: "Please enter a valid age (18-120)",
      },
    )
    .transform((val) => parseInt(String(val), 10)),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Invalid 12-digit Aadhaar number"),
  panNumber: z
    .string()
    .regex(/^[a-zA-Z0-9]{10}$/, "Invalid 10-character PAN format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // Image URLs (already uploaded to ImageKit)
  aadhaarImage: z.string().url("Aadhaar image is required"),
  panImage: z.string().url("PAN image is required"),
  faceImage: z.string().url("Face verification image is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = onboardingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = validation.data;

    // Hash the token to match stored version
    const hashedToken = crypto
      .createHash("sha256")
      .update(data.token)
      .digest("hex");

    await connectDB();

    const user = await User.findOne({
      setPasswordToken: hashedToken,
      setPasswordExpires: { $gt: new Date() },
      role: "agent",
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired onboarding link. Please register again." },
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(data.password, 12);

    // Update agent profile
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.name = `${data.firstName} ${data.lastName}`;
    user.gender = data.gender as any;
    user.age = data.age;
    user.phone = data.phone;
    user.address = data.address;
    user.aadhaarNumber = data.aadhaarNumber;
    user.panNumber = data.panNumber;
    user.password = hashedPassword;
    user.image = data.faceImage;
    user.documents = {
      aadharCard: [data.aadhaarImage],
      panCard: [data.panImage],
      passport: [],
    };
    user.verificationStatus = "pending";
    user.isActivated = false; // Still not active until admin verifies
    user.setPasswordToken = undefined;
    user.setPasswordExpires = undefined;

    await user.save();

    // Notify admin
    await sendAgentVerificationNotification({
      agentName: user.name,
      agentEmail: user.email,
      agentPhone: user.phone,
      agentGender: user.gender,
      agentAge: user.age,
    });

    // Send In-App Notifications to Admins
    const admins = await User.find({ role: "admin" }, "_id").lean();
    const adminIds = admins.map((admin) => admin._id.toString());

    if (adminIds.length > 0) {
      await createBulkNotification(adminIds, {
        title: "New Agent Onboarding",
        message: `${user.name} has completed their onboarding and is pending verification.`,
        type: "info",
        link: "/admin/agents", // Assuming this is the link to verify agents
      });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Onboarding complete! Your account is pending admin verification.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Onboarding completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
