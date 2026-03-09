"use server";

import { auth } from "@/lib/auth";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { revalidatePath } from "next/cache";

export async function updateAgentProfile(formData: {
  name: string;
  phone: string;
  age: number;
  gender: "male" | "female" | "other";
  address: string;
  aadhaarNumber: string;
  panNumber: string;
  image?: string;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    branchName?: string;
  };
  upiId?: string;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "agent") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return { success: false, error: "User not found" };

    user.name = formData.name;
    user.phone = formData.phone;
    user.age = formData.age;
    user.gender = formData.gender;
    user.address = formData.address;
    user.aadhaarNumber = formData.aadhaarNumber;
    user.panNumber = formData.panNumber;
    if (formData.image) user.image = formData.image;
    if (formData.bankDetails) {
      user.bankDetails = {
        accountHolderName: formData.bankDetails.accountHolderName || "",
        accountNumber: formData.bankDetails.accountNumber || "",
        bankName: formData.bankDetails.bankName || "",
        ifscCode: formData.bankDetails.ifscCode || "",
        branchName: formData.bankDetails.branchName || "",
      };
      user.markModified("bankDetails");
    }
    if (formData.upiId) user.upiId = formData.upiId;

    await user.save();

    revalidatePath("/admin/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Update Profile Error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function submitVerification(documents: {
  aadharCard: string[];
  panCard: string[];
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "agent") {
    return { success: false, error: "Unauthorized" };
  }

  if (!documents.aadharCard.length || !documents.panCard.length) {
    return { success: false, error: "Aadhaar and PAN cards are required" };
  }

  try {
    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return { success: false, error: "User not found" };

    user.documents = {
      ...user.documents,
      aadharCard: documents.aadharCard,
      panCard: documents.panCard,
      passport: user.documents?.passport || [],
    };
    user.verificationStatus = "pending";

    await user.save();

    revalidatePath("/admin/profile");
    return { success: true, message: "Verification request submitted" };
  } catch (error) {
    console.error("Verification Submission Error:", error);
    return { success: false, error: "Failed to submit verification" };
  }
}

export async function getAgentProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectDB();
  const user = await User.findById(session.user.id).lean();
  if (!user) return null;

  return JSON.parse(JSON.stringify(user));
}
