"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";
import { verifyAdmin } from "@/lib/auth-check";
import { generatePassword } from "@/lib/password";
import crypto from "crypto";
import {
  sendAgentWelcomeEmail,
  sendAgentPromotionEmail,
  sendAgentRejectionEmail,
  sendAgentApprovalEmail,
} from "@/lib/email";

const createAgentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

export async function createAgent(prevState: unknown, formData: FormData) {
  try {
    await verifyAdmin(); // Ensure only admins can create agents
    await connectDB();

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    const validatedFields = createAgentSchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Validation failed. Please check your inputs.",
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, phone } = validatedFields.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      if (existingUser.role === "customer") {
        // Promote customer to agent
        existingUser.role = "agent";
        existingUser.status = "active"; // Ensure they are active
        await existingUser.save();

        const emailRes = await sendAgentPromotionEmail({
          name: existingUser.name,
          email: existingUser.email,
          to: existingUser.email,
        });

        if (!emailRes.success) {
          return {
            success: true,
            message:
              "Customer promoted to agent, but failed to send notification email. Check logs.",
          };
        }

        revalidatePath("/admin/agents");
        return {
          success: true,
          message:
            "Existing customer has been promoted to Travel Agent. Notification sent.",
        };
      } else {
        return {
          success: false,
          error: `User with this email already exists as an ${existingUser.role}.`,
        };
      }
    }

    // Generate random password
    const tempPassword = generatePassword();
    const hashedPassword = await bcryptjs.hash(tempPassword, 12);

    // Create user
    // Create user
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "agent",
      status: "active",
      phone,
      mustChangePassword: true,
    });

    // Send welcome email with temp password
    const emailRes = await sendAgentWelcomeEmail({
      name,
      email: email.toLowerCase(),
      password: tempPassword,
      to: email.toLowerCase(),
    });

    if (!emailRes.success) {
      console.error("Failed to send welcome email:", emailRes.error);
      // We don't rollback user creation, but we should inform the admin
      return {
        success: true,
        message: "Agent created, but failed to send welcome email. Check logs.",
        tempPassword, // Return password to admin so they can manually share
      };
    }

    revalidatePath("/admin/agents");

    return {
      success: true,
      message: "Agent created successfully. Welcome email sent.",
    };
  } catch (error: unknown) {
    console.error(
      "Create agent error:",
      error instanceof Error ? error.message : error,
    );
    return {
      success: false,
      error: "Failed to create agent. Please try again.",
    };
  }
}

export async function toggleAgentStatus(agentId: string) {
  try {
    await verifyAdmin();
    await connectDB();

    const agent = await User.findById(agentId);
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    if (agent.role === "admin") {
      return { success: false, error: "Cannot modify admin status" };
    }

    const newStatus = agent.status === "active" ? "inactive" : "active";
    agent.status = newStatus;
    await agent.save();

    revalidatePath("/admin/agents");
    return { success: true, message: `Agent status updated to ${newStatus}` };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update status";
    return { success: false, error: message };
  }
}

export async function deleteAgent(agentId: string) {
  try {
    await verifyAdmin();
    await connectDB();

    const agent = await User.findById(agentId);
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    if (agent.role === "admin") {
      return { success: false, error: "Cannot delete admin accounts" };
    }

    // Optional: Check if agent has leads assigned before deleting
    // const hasLeads = await Lead.exists({ agentId });
    // if (hasLeads) return { success: false, error: "Reassign leads before deleting" };

    await User.findByIdAndDelete(agentId);

    revalidatePath("/admin/agents");
    return { success: true, message: "Agent deleted successfully" };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete agent";
    return { success: false, error: message };
  }
}

export async function updateAgentVerificationStatus(
  agentId: string,
  status: "approved" | "rejected",
  note?: string,
) {
  try {
    await verifyAdmin();
    await connectDB();

    const agent = await User.findById(agentId);
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    let shouldSaveToken = false;
    let resubmitUrl = "";

    agent.verificationStatus = status;
    agent.verificationNote = note || "";

    if (status === "approved") {
      agent.isVerified = true;
      agent.isActivated = true; // Make sure they can actually log in now
    } else {
      agent.isVerified = false;
      agent.isActivated = false;

      // Generate a new token for resubmission
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      agent.setPasswordToken = hashedToken;
      agent.setPasswordExpires = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

      resubmitUrl = `${process.env.NEXTAUTH_URL}/admin/onboarding?token=${token}`;
      shouldSaveToken = true;
    }

    await agent.save();

    // Send email notifications
    if (status === "rejected") {
      await sendAgentRejectionEmail({
        agentName: agent.name,
        agentEmail: agent.email,
        rejectionNote: note || "",
        resubmitUrl: resubmitUrl,
      });
    } else if (status === "approved") {
      await sendAgentApprovalEmail({
        agentName: agent.name,
        agentEmail: agent.email,
      });
    }

    revalidatePath("/admin/agents");
    revalidatePath("/admin/profile"); // In case the agent is viewing their own profile

    return {
      success: true,
      message: `Agent verification ${status === "approved" ? "approved" : "rejected"} successfully`,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update verification status";
    return { success: false, error: message };
  }
}

export async function updateAgentSubscription(
  agentId: string,
  status: "active" | "expired" | "pending",
  plan: "free" | "pro",
  billingCycle?: "monthly" | "90days" | "yearly",
  transactionId?: string,
) {
  try {
    await verifyAdmin();
    await connectDB();

    const agent = await User.findById(agentId);
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    agent.plan = plan;
    agent.subscriptionStatus = status;
    if (transactionId) agent.transactionId = transactionId;
    
    if (status === "active" && billingCycle) {
      agent.billingCycle = billingCycle;
      
      const endDate = new Date();
      if (billingCycle === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (billingCycle === "90days") {
        endDate.setDate(endDate.getDate() + 90);
      } else if (billingCycle === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      agent.subscriptionEndDate = endDate;
      agent.subscriptionStartDate = new Date();
    } else if (plan === "free" || status === "expired") {
      agent.subscriptionEndDate = undefined;
      // Keep billing cycle for record? Let's clear it if they go to free
      if (plan === "free") agent.billingCycle = undefined;
    }

    await agent.save();

    revalidatePath("/admin/agents");
    revalidatePath("/admin/subscriptions");
    revalidatePath("/admin/subscription");

    return {
      success: true,
      message: `Subscription ${status === "active" ? "approved" : "updated"} successfully`,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update subscription status";
    return { success: false, error: message };
  }
}
