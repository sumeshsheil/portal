import Notification from "@/lib/db/models/Notification";
import { connectDB } from "@/lib/db/mongoose";

interface CreateNotificationParams {
  userId: string; // Recipient
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  link?: string;
}

/**
 * Creates a notification for a user.
 * Non-blocking: Errors are logged but do not throw.
 */
export async function createNotification(
  params: CreateNotificationParams,
): Promise<void> {
  try {
    await connectDB();

    await Notification.create({
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      link: params.link,
    });

    // Optionally trigger invalidation or push notification logic here if needed
    // revalidatePath("/admin"); // Revalidate entire admin area if feasible, but target specific paths usually better
  } catch (error: unknown) {
    console.error(
      "Failed to create notification:",
      error instanceof Error ? error.message : error,
    );
  }
}

/**
 * Creates a notification for multiple users (e.g., all admins).
 */
export async function createBulkNotification(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">,
): Promise<void> {
  try {
    await connectDB();

    const notifications = userIds.map((userId) => ({
      userId,
      ...params,
      type: params.type || "info",
    }));

    await Notification.insertMany(notifications);
  } catch (error: unknown) {
    console.error(
      "Failed to create bulk notifications:",
      error instanceof Error ? error.message : error,
    );
  }
}
