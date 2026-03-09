import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { sendSetPasswordEmail, sendWelcomeEmail } from "@/lib/email";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email } = validation.data;
    const customerEmail = email.toLowerCase();

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: customerEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Generate token for password setting
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Create inactive user with placeholder password
    // We need a password field in the DB to satisfy schema if it's required (usually is)
    const placeholderPassword = await bcryptjs.hash(
      crypto.randomBytes(16).toString("hex"),
      12,
    );

    const name = customerEmail.split("@")[0];
    const newUser = await User.create({
      email: customerEmail,
      password: placeholderPassword,
      name: name,
      role: "customer",
      status: "active",
      isActivated: false,
      isPhoneVerified: false,
      setPasswordToken: hashedToken,
      setPasswordExpires: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
    });

    // The link will open a popup on the landing page
    const landingUrl = process.env.LANDING_URL || "http://localhost:3000";
    const setPasswordUrl = `${landingUrl}/?token=${rawToken}&action=set-password`;

    // Send Welcome and Set Password Emails
    await sendWelcomeEmail({
      name: name,
      to: customerEmail,
    });

    await sendSetPasswordEmail({
      name: name,
      email: customerEmail,
      setPasswordUrl,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Check your email to set your password and activate your account.",
        user: {
          id: newUser._id,
          email: newUser.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
