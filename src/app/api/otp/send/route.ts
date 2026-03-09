import {
    checkPhoneRateLimit, getAuthToken, getTestSendResponse, isTestPhone
} from "@/lib/sms";
import { NextResponse } from "next/server";

const MC_BASE_URL = "https://cpaas.messagecentral.com";
const MC_CUSTOMER_ID = process.env.MC_CUSTOMER_ID!;

// Supported country codes for phone verification
const SUPPORTED_COUNTRIES: Record<string, { regex: RegExp; label: string }> = {
  "91": { regex: /^[6-9]\d{9}$/, label: "Indian (10 digits)" },
  "880": { regex: /^1[3-9]\d{8}$/, label: "Bangladeshi (11 digits)" },
};

/**
 * POST /api/otp/send
 * Sends an OTP via MessageCentral Verify Now (OTP Service)
 *
 * Body: { phone: string, countryCode?: string }
 * Returns: { success: true, verificationId: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, countryCode = "91" } = body;

    // --- TEST MODE BYPASS ---
    if (isTestPhone(phone)) {
      return NextResponse.json(getTestSendResponse());
    }

    // Validate country code
    const country = SUPPORTED_COUNTRIES[countryCode];
    if (!country) {
      return NextResponse.json(
        {
          error: `Unsupported country code. Supported: ${Object.keys(SUPPORTED_COUNTRIES).join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Validate phone number format
    if (!phone || !country.regex.test(phone)) {
      return NextResponse.json(
        { error: `Please provide a valid ${country.label} phone number` },
        { status: 400 },
      );
    }

    // Per-phone rate limit
    const { allowed, retryAfterSeconds } = checkPhoneRateLimit(phone);
    if (!allowed) {
      return NextResponse.json(
        {
          error: retryAfterSeconds
            ? `Please wait ${retryAfterSeconds} seconds before requesting a new OTP.`
            : "Too many OTP requests for this number. Please try again later.",
        },
        { status: 429 },
      );
    }

    // 1. Get cached auth token
    const authToken = await getAuthToken();

    // 2. Send OTP via MessageCentral Verify Now (minimal params)
    const sendUrl = `${MC_BASE_URL}/verification/v3/send?countryCode=${countryCode}&customerId=${encodeURIComponent(MC_CUSTOMER_ID)}&flowType=SMS&mobileNumber=${phone}`;



    const sendRes = await fetch(sendUrl, {
      method: "POST",
      headers: { authToken },
    });

    const sendJson = await sendRes.json();

    if (sendJson.responseCode !== 200 || !sendJson.data?.verificationId) {
      const mcMessage =
        sendJson.message || sendJson.data?.errorMessage || "Unknown error";
      const mcCode = sendJson.responseCode || sendRes.status;

      console.error(`MessageCentral send OTP failed [${mcCode}]: ${mcMessage}`);

      if (mcCode === 800) {
        return NextResponse.json(
          { error: "Maximum OTP limit reached. Please try again later." },
          { status: 429 },
        );
      }

      if (mcCode === 506 || mcMessage === "REQUEST_ALREADY_EXISTS") {
        return NextResponse.json(
          {
            error:
              "An OTP was already sent. Please wait at least 30 seconds before requesting a new one.",
          },
          { status: 429 },
        );
      }

      if (mcCode === 913 || mcMessage === "SMS_SUBSCRIPTION_NOT_ACTIVE") {
        return NextResponse.json(
          { error: "SMS service is not active. Please contact support." },
          { status: 503 },
        );
      }

      return NextResponse.json(
        { error: "Failed to send OTP. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      verificationId: sendJson.data.verificationId,
    });
  } catch (error: unknown) {
    console.error(
      "OTP send error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
