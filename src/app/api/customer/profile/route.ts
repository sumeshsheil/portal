import { auth } from "@/lib/auth";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

// GET — return customer profile
export async function GET() {
  try {
    const session = await auth();
    const isAuthorized =
      session &&
      (session.user.role === "customer" ||
        session.user.role === "agent" ||
        session.user.role === "admin");

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id)
      .select("-password -setPasswordToken -setPasswordExpires")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH — update allowed fields
// PATCH — update profile
const updateSchema = z.object({
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  name: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  altPhone: z.string().optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  birthDate: z.string().datetime().optional().or(z.literal("")),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar must be 12 digits")
    .optional()
    .or(z.literal("")),
  passportNumber: z
    .string()
    .regex(
      /^[a-zA-Z0-9]{8}$/,
      "Passport must be exactly 8 alphanumeric characters",
    )
    .optional()
    .or(z.literal("")),
  documents: z
    .object({
      aadharCard: z.array(z.string().url()).optional(),
      passport: z.array(z.string().url()).optional(),
    })
    .optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    const isAuthorized =
      session &&
      (session.user.role === "customer" ||
        session.user.role === "agent" ||
        session.user.role === "admin");

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = updateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const updates = validation.data;
    await connectDB();

    // Fetch current user to merge and verify
    const currentUser = await User.findById(session.user.id);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Auto-update full name if first/last provided
    if (updates.firstName && updates.lastName) {
      updates.name = `${updates.firstName} ${updates.lastName}`;
    } else if (updates.firstName) {
      updates.name =
        `${updates.firstName} ${currentUser.lastName || ""}`.trim();
    } else if (updates.lastName) {
      updates.name =
        `${currentUser.firstName || ""} ${updates.lastName}`.trim();
    }

    // Prevent changing existing email and main phone
    if (
      currentUser.email &&
      updates.email &&
      updates.email !== currentUser.email
    ) {
      delete updates.email;
    }
    if (
      currentUser.phone &&
      updates.phone &&
      updates.phone !== currentUser.phone
    ) {
      delete updates.phone;
    }

    if (updates.gender === "") {
      delete updates.gender;
    }

    // Replacement logic: Only fallback to old value if the key is MISSING from updates (undefined)
    // This allows clearing fields by sending an empty string/array.
    const finalAadhar =
      updates.documents?.aadharCard !== undefined
        ? updates.documents.aadharCard
        : (currentUser.documents?.aadharCard ?? []);

    const finalPassport =
      updates.documents?.passport !== undefined
        ? updates.documents.passport
        : (currentUser.documents?.passport ?? []);

    const finalAadhaarNumber =
      updates.aadhaarNumber !== undefined
        ? updates.aadhaarNumber
        : currentUser.aadhaarNumber;

    const finalPassportNumber =
      updates.passportNumber !== undefined
        ? updates.passportNumber
        : currentUser.passportNumber;

    // Strict Sync: If document exists, number must exist. If number exists, document must exist.
    if (
      (finalAadhar.length > 0 && !finalAadhaarNumber) ||
      (finalAadhaarNumber && finalAadhar.length === 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Both Aadhar Number and Aadhar Card PDF are required together.",
        },
        { status: 400 },
      );
    }

    // Merge documents
    const mergedDocuments = {
      aadharCard: finalAadhar,
      passport: finalPassport,
    };

    const finalFirstName =
      updates.firstName !== undefined
        ? updates.firstName
        : currentUser.firstName;
    const finalLastName =
      updates.lastName !== undefined ? updates.lastName : currentUser.lastName;
    const finalBirthDate =
      updates.birthDate !== undefined
        ? updates.birthDate
        : currentUser.birthDate;
    const finalGender =
      updates.gender !== undefined ? updates.gender : currentUser.gender;

    // User is verified if they have provided all mandatory fields
    const isVerified =
      !!finalFirstName &&
      !!finalLastName &&
      !!finalBirthDate &&
      !!finalGender &&
      !!currentUser.email &&
      !!currentUser.phone &&
      !!currentUser.isPhoneVerified &&
      mergedDocuments.aadharCard.length > 0 &&
      !!finalAadhaarNumber &&
      /^\d{12}$/.test(finalAadhaarNumber);

    // Apply updates
    // Remove ID numbers from updates to prevent overwriting the final calculated values
    delete (updates as any).aadhaarNumber;
    delete (updates as any).passportNumber;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          ...updates,
          aadhaarNumber: finalAadhaarNumber,
          passportNumber: finalPassportNumber,
          documents: mergedDocuments, // Ensure merged docs are saved
          isVerified,
        },
      },
      { new: true, runValidators: true },
    )
      .select("-password -setPasswordToken -setPasswordExpires")
      .lean();

    return NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
