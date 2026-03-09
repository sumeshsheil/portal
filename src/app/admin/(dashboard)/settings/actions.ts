"use server";

import { auth } from "@/lib/auth";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
});

export async function updateProfile(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const rawData = {
      name: formData.get("name"),
      phone: formData.get("phone") || undefined,
    };

    const validation = profileSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    await connectDB();

    await User.findByIdAndUpdate(session.user.id, {
      name: validation.data.name,
      phone: validation.data.phone,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/settings");

    return { success: true, message: "Profile updated successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, error: message };
  }
}
