import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = verifyOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, otp } = validation.data;

    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
      setPasswordToken: otp,
      setPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 },
      );
    }

    // OTP is valid. We don't change anything yet, just return success so UI can proceed to password reset screen.
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
