import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { z } from "zod";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { sendAgentOnboardingEmail } from "@/lib/email";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
    const agentEmail = email.toLowerCase();

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: agentEmail });
    if (existingUser) {
      // If agent exists but hasn't completed onboarding, resend email
      if (
        existingUser.role === "agent" &&
        !existingUser.isActivated &&
        existingUser.verificationStatus === "unverified"
      ) {
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
          .createHash("sha256")
          .update(rawToken)
          .digest("hex");

        existingUser.setPasswordToken = hashedToken;
        existingUser.setPasswordExpires = new Date(
          Date.now() + 72 * 60 * 60 * 1000,
        );
        await existingUser.save();

        const portalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        const onboardingUrl = `${portalBaseUrl}/admin/onboarding?token=${rawToken}`;
        await sendAgentOnboardingEmail({
          name: existingUser.name,
          to: agentEmail,
          onboardingUrl,
        });

        return NextResponse.json(
          {
            success: true,
            message:
              "Onboarding email resent. Check your inbox to complete registration.",
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 400 },
      );
    }

    // Generate onboarding token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Create inactive agent with placeholder password
    const placeholderPassword = await bcryptjs.hash(
      crypto.randomBytes(16).toString("hex"),
      12,
    );

    const name = agentEmail.split("@")[0];
    await User.create({
      email: agentEmail,
      password: placeholderPassword,
      name,
      role: "agent",
      status: "inactive",
      isActivated: false,
      isPhoneVerified: false,
      verificationStatus: "unverified",
      setPasswordToken: hashedToken,
      setPasswordExpires: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
    });

    const portalBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const onboardingUrl = `${portalBaseUrl}/admin/onboarding?token=${rawToken}`;

    await sendAgentOnboardingEmail({
      name,
      to: agentEmail,
      onboardingUrl,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration started! Check your email to complete your onboarding.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Agent registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
