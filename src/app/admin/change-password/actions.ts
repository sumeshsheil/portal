"use server";

import { auth } from "@/lib/auth";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import bcryptjs from "bcryptjs";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Current password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export async function changePassword(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const rawData = {
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validation = changePasswordSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const { currentPassword, newPassword } = validation.data;

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Verify current password
    const isValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Hash and save new password
    const hashedPassword = await bcryptjs.hash(newPassword, 12);
    user.password = hashedPassword;
    user.mustChangePassword = false;
    await user.save();

    return {
      success: true,
      message:
        "Password changed successfully. Please log in again with your new password.",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to change password";
    console.error("Change password error:", message);
    return { success: false, error: message };
  }
}
