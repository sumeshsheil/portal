import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const validateLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = validateLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Please enter a valid email and password.",
          code: "VALIDATION",
        },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    await connectDB();

    // 1. Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        {
          error: "No account found with this email address.",
          code: "NO_USER",
        },
        { status: 404 },
      );
    }

    // 2. Check if account is active
    if (user.status !== "active") {
      return NextResponse.json(
        {
          error: "This account has been deactivated. Please contact support.",
          code: "INACTIVE",
        },
        { status: 403 },
      );
    }

    // 3. Check if customer account is activated
    if (user.role === "customer" && !user.isActivated) {
      return NextResponse.json(
        {
          error:
            "Your account is not yet activated. Please check your email for the activation link, or use Forgot Password to set up your password.",
          code: "NOT_ACTIVATED",
        },
        { status: 403 },
      );
    }

    // 4. Check password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Incorrect password. Please try again.",
          code: "WRONG_PASSWORD",
        },
        { status: 401 },
      );
    }

    // All checks passed
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Validate login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
