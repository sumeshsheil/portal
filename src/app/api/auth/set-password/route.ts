import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const setPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = setPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { token, password } = validation.data;

    await connectDB();

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid, non-expired token
    const user = await User.findOne({
      setPasswordToken: hashedToken,
      setPasswordExpires: { $gt: new Date() },
      role: "customer",
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Invalid or expired token. Please request a new password link.",
        },
        { status: 400 },
      );
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Update user
    user.password = hashedPassword;
    user.isActivated = true;
    user.setPasswordToken = undefined;
    user.setPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password set successfully. You can now log in.",
      email: user.email,
    });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json(
      { error: "Failed to set password. Please try again." },
      { status: 500 },
    );
  }
}
