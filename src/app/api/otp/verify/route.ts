import { auth } from "@/lib/auth";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import {
    getAuthToken, getMCErrorStatus, getTestVerifyResponse, isTestVerification, MC_ERROR_MESSAGES
} from "@/lib/sms";
import { NextResponse } from "next/server";

const MC_BASE_URL = "https://cpaas.messagecentral.com";
const MC_CUSTOMER_ID = process.env.MC_CUSTOMER_ID!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { verificationId, otp, phone, countryCode = "91" } = body;

    if (isTestVerification(verificationId, otp)) {
      const session = await auth();
      if (session?.user?.id) {
        await connectDB();
        await User.findByIdAndUpdate(session.user.id, {
          isPhoneVerified: true,
        });
      }
      return NextResponse.json(getTestVerifyResponse());
    }

    if (!verificationId || typeof verificationId !== "string") {
      return NextResponse.json(
        { error: "Invalid verification session" },
        { status: 400 },
      );
    }

    if (!otp || !/^\d{4,8}$/.test(otp)) {
      return NextResponse.json(
        { error: "Please enter a valid OTP" },
        { status: 400 },
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required for verification" },
        { status: 400 },
      );
    }

    const authToken = await getAuthToken();

    const validateUrl = `${MC_BASE_URL}/verification/v3/validateOtp?countryCode=${countryCode}&mobileNumber=${phone}&verificationId=${encodeURIComponent(verificationId)}&customerId=${encodeURIComponent(MC_CUSTOMER_ID)}&code=${encodeURIComponent(otp)}`;



    const validateRes = await fetch(validateUrl, {
      method: "GET",
      headers: { authToken },
    });

    const validateJson = await validateRes.json();

    if (
      validateJson.responseCode === 200 &&
      validateJson.data?.verificationStatus === "VERIFICATION_COMPLETED"
    ) {
      const session = await auth();
      if (session?.user?.id) {
        await connectDB();
        await User.findByIdAndUpdate(session.user.id, {
          isPhoneVerified: true,
        });
      }

      return NextResponse.json({
        success: true,
        verified: true,
      });
    }

    if (validateJson.responseCode === 200) {
      const session = await auth();
      if (session?.user?.id) {
        await connectDB();
        await User.findByIdAndUpdate(session.user.id, {
          isPhoneVerified: true,
        });
      }

      return NextResponse.json({
        success: true,
        verified: true,
      });
    }

    const errorMessage =
      MC_ERROR_MESSAGES[validateJson.responseCode] ||
      validateJson.message ||
      validateJson.data?.errorMessage ||
      "OTP verification failed";

    console.error(
      `MC OTP validation failed [${validateJson.responseCode}]: ${errorMessage}`,
    );

    return NextResponse.json(
      {
        error: errorMessage,
        code: validateJson.responseCode,
      },
      { status: getMCErrorStatus(validateJson.responseCode) },
    );
  } catch (error: unknown) {
    console.error(
      "OTP verify error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
