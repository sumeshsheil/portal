import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, otp, password } = validation.data;

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

    // Hash new password
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update user — also activate the account so newsletter users
    // who reset their password can log in immediately
    user.password = hashedPassword;
    user.isActivated = true;
    user.setPasswordToken = undefined;
    user.setPasswordExpires = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
