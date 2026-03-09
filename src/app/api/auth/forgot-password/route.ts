import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { sendOtpEmail } from "@/lib/email";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  isAdminFlow: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const { email, isAdminFlow } = validation.data;

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Explicit error as requested by user
      return NextResponse.json(
        { error: "User not found with this email access" },
        { status: 404 },
      );
    }

    // Check if user has admin/agent role if this is an admin flow
    if (isAdminFlow && user.role === "customer") {
      return NextResponse.json(
        { error: "This email is not associated with an admin account." },
        { status: 403 },
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in setPasswordToken (reusing field) and expiry
    user.setPasswordToken = otp;
    user.setPasswordExpires = otpExpires;

    await user.save();

    // Send OTP via Email
    await sendOtpEmail({ email, otp });


    return NextResponse.json({
      success: true,
      message: "OTP sent to your email address.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
