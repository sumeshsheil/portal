"use server";

import { auth } from "@/lib/auth";
import Contact from "@/lib/db/models/Contact";
import Lead from "@/lib/db/models/Lead";
import Notification from "@/lib/db/models/Notification";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { DASHBOARD_URL, sendSetPasswordEmail, sendWelcomeEmail } from "@/lib/email";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

interface DashboardStats {
  totalLeads: number;
  activeAgents: number;
  conversionRate: string;
  totalRevenue: number;     // Verified payments
  totalCost: number;        // Realized cost
  totalProfit: number;      // Realized profit
  recentLeads: Array<{
    _id: string;
    traveler: string;
    destination: string;
    stage: string;
    date: string;
    agent: string;
  }>;
  isAgent: boolean;
  createdContacts: number;
  wonLeadsCount: number;
}

const createCustomerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  altPhone: z.string().optional().nullable(),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 18, {
    message: "Age must be 18 or older",
  }),
  gender: z.string().refine((val) => ["male", "female", "other"].includes(val), {
    message: "Gender is required",
  }) as z.ZodType<"male" | "female" | "other">,
});

export async function getDashboardStats(): Promise<DashboardStats> {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await connectDB();

  const isAgent = session.user.role === "agent";

  // Scope all queries: agents only see their own leads
  const leadFilter = isAgent ? { agentId: session.user.id } : {};

  const wonFilter = isAgent
    ? { stage: "won" as const, agentId: session.user.id }
    : { stage: "won" as const };

  // 1. Initial counts and baseline data
  const [totalLeads, activeAgents, wonLeadsCount, recentLeads, createdContacts] =
    await Promise.all([
      Lead.countDocuments(leadFilter),
      isAgent
        ? Promise.resolve(0)
        : User.countDocuments({ role: "agent", status: "active" }),
      Lead.countDocuments(wonFilter),
      Lead.find(leadFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("agentId", "name")
        .lean(),
      isAgent ? Contact.countDocuments({ agentId: session.user.id }) : Contact.countDocuments(),
    ]);

  // 2. Realized metrics from all leads the user can see
  const allLeads = await Lead.find(leadFilter)
    .select("tripCost netAmount tripProfit bookingPayments")
    .lean();

  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;

  allLeads.forEach((lead: any) => {
    const verifiedSum = (lead.bookingPayments || [])
      .filter((p: any) => p.status === "verified")
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    
    if (verifiedSum > 0) {
      totalRevenue += verifiedSum;
      const tripCost = lead.tripCost || 0;
      // Proportionally distribute verified payments between cost and profit
      if (tripCost > 0) {
        const ratio = verifiedSum / tripCost;
        totalCost += (lead.netAmount || 0) * ratio;
        totalProfit += (lead.tripProfit || 0) * ratio;
      }
    }
  });

  const conversionRate =
    totalLeads > 0 ? ((wonLeadsCount / totalLeads) * 100).toFixed(1) : "0";

  // Serialize recent leads — use simple mapping to avoid Mongoose type complexity
  const serializedLeads = JSON.parse(JSON.stringify(recentLeads)).map(
    (lead: {
      _id: string;
      travelers?: { name?: string }[];
      destination?: string;
      stage?: string;
      createdAt?: string;
      agentId?: { name?: string };
    }) => ({
      _id: lead._id,
      traveler: lead.travelers?.[0]?.name || "Unknown",
      destination: lead.destination || "Unknown",
      stage: lead.stage || "new",
      date: lead.createdAt || new Date().toISOString(),
      agent: lead.agentId?.name || "Unassigned",
    }),
  );

  return {
    totalLeads,
    activeAgents,
    conversionRate,
    totalRevenue: Math.round(totalRevenue),
    totalCost: Math.round(totalCost),
    totalProfit: Math.round(totalProfit),
    recentLeads: serializedLeads,
    isAgent,
    createdContacts,
    wonLeadsCount,
  };
}

// ============ NOTIFICATION ACTIONS ============

export interface NotificationItem {
  _id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export async function getUnreadNotifications(): Promise<NotificationItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  await connectDB();

  // Fetch unread notifications, limit 20
  const notifications = await Notification.find({
    userId: session.user.id,
    isRead: false,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return JSON.parse(JSON.stringify(notifications));
}

export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  await connectDB();

  await Notification.updateOne(
    { _id: notificationId, userId: session.user.id },
    { isRead: true },
  );

  revalidatePath("/admin");
  return { success: true };
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  await connectDB();

  await Notification.updateMany(
    { userId: session.user.id, isRead: false },
    { isRead: true },
  );

  revalidatePath("/admin");
  return { success: true };
}

export async function createCustomer(prevState: unknown, formData: FormData) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin" && session?.user?.role !== "agent") {
      throw new Error("Unauthorized");
    }

    await connectDB();

    const rawData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      altPhone: formData.get("altPhone") || null,
      age: formData.get("age"),
      gender: formData.get("gender"),
    };

    const validation = createCustomerSchema.safeParse(rawData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0];
      return {
        success: false,
        error: firstError || "Validation failed",
        fieldErrors,
      };
    }

    const { firstName, lastName, email, phone, altPhone, age, gender } =
      validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        error: `User with this email already exists as a ${existingUser.role}.`,
      };
    }

    // Generate token for password setup
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Placeholder password (will be changed via set-password link)
    const placeholderPassword = await bcryptjs.hash(
      crypto.randomBytes(16).toString("hex"),
      12,
    );

    const newUser = await User.create({
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email: email.toLowerCase(),
      phone,
      altPhone: altPhone || undefined,
      age: Number(age),
      gender,
      role: "customer",
      status: "active",
      password: placeholderPassword,
      mustChangePassword: true,
      setPasswordToken: hashedToken,
      setPasswordExpires: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
    });

    // Send welcome and set password emails
    const setPasswordUrl = `${DASHBOARD_URL}/?token=${token}&action=set-password`;
    await sendWelcomeEmail({
      name: firstName,
      to: email.toLowerCase(),
    });

    await sendSetPasswordEmail({
      name: firstName,
      email: email.toLowerCase(),
      setPasswordUrl,
    });

    revalidatePath("/admin/customers");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Customer created successfully. Welcome email sent.",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create customer";
    console.error("Create customer error:", error);
    return { success: false, error: message };
  }
}
