"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db/mongoose";
import Contact from "@/lib/db/models/Contact";
import User from "@/lib/db/models/User";
import { auth } from "@/lib/auth";

const PLAN_LIMITS = {
  free: 30,
  basic: 100,
  pro: Infinity,
  premium: Infinity,
  enterprise: Infinity,
};

export async function createContact(formData: FormData) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "agent") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const agentId = session.user.id;
    const agent = await User.findById(agentId);
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    const plan = (agent.plan || "free") as keyof typeof PLAN_LIMITS;
    const limit = PLAN_LIMITS[plan] || 30;

    if (agent.leadCount >= limit) {
      return {
        success: false,
        error: `Lead limit reached for ${plan} plan. Please upgrade to add more leads.`,
      };
    }

    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString();
    const notes = formData.get("notes")?.toString();

    if (!name) {
      return { success: false, error: "Name is required" };
    }

    if (email) {
      const existingContact = await Contact.findOne({ 
        agentId, 
        email: email.toLowerCase().trim() 
      });
      if (existingContact) {
        return { success: false, error: "A contact with this email already exists in your list." };
      }
    }

    // Notice we do NOT check or create a `User` record here anymore.
    // We just save the contact to the agent's address book.
    const newContact = await Contact.create({
      agentId,
      name,
      email: email ? email.toLowerCase().trim() : undefined,
      phone,
      notes,
      userId: undefined, // Explicitly no user ID linked
    });

    // Increment lead count
    await User.findByIdAndUpdate(agentId, { $inc: { leadCount: 1 } });

    revalidatePath("/admin/contacts");
    return { success: true, contact: JSON.parse(JSON.stringify(newContact)) };
  } catch (error: any) {
    console.error("Error creating contact:", error);
    return { success: false, error: error.message || "Failed to create contact" };
  }
}

export async function createCustomerAccount(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const agentId = session.user.id;
    const agent = await User.findById(agentId);
    
    if (!agent) {
      return { success: false, error: "Agent not found" };
    }

    // Verify Authorization: Only Admin or Enterprise Agents can create platform accounts via this route
    if (agent.role !== "admin" && agent.plan !== "enterprise") {
      return { success: false, error: "Your current plan does not support creating platform user accounts." };
    }

    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const name = `${firstName || ""} ${lastName || ""}`.trim();
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString();
    const altPhone = formData.get("altPhone")?.toString();
    const age = formData.get("age")?.toString();
    const gender = formData.get("gender")?.toString();
    const notes = formData.get("notes")?.toString();

    if (!firstName || !lastName) {
      return { success: false, error: "First and last name are required" };
    }
    if (!email) {
      return { success: false, error: "Email is required to create a platform account" };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if the Contact already exists in the agent's list
    const existingContact = await Contact.findOne({ 
      agentId, 
      email: normalizedEmail 
    });
    if (existingContact) {
      return { success: false, error: "A contact with this email already exists in your list." };
    }

    // 2. Check if the User already exists globally
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return { success: false, error: `A user account with this email already exists on the platform as a ${user.role}.` };
    }

    // 3. Create a new User account
    const crypto = await import("crypto");
    const bcryptjs = await import("bcryptjs");
    const { sendWelcomeEmail, sendSetPasswordEmail } = await import("@/lib/email");

    // Generate random temporary password
    const tempPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcryptjs.hash(tempPassword, 12);

    // Generate password set token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const tokenExpires = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    user = await User.create({
      email: normalizedEmail,
      name: name,
      firstName,
      lastName,
      phone,
      altPhone: altPhone || undefined,
      age: age ? Number(age) : undefined,
      gender,
      password: hashedPassword,
      role: "customer",
      status: "active",
      isVerified: true,
      isPhoneVerified: false,
      isActivated: true,
      mustChangePassword: true,
      setPasswordToken: hashedToken,
      setPasswordExpires: tokenExpires,
    });

    // Send welcome and set password emails
    const landingUrl = process.env.LANDING_URL || process.env.NEXTAUTH_URL;
    const setPasswordUrl = `${landingUrl}/dashboard/set-password?token=${token}`;
    await sendWelcomeEmail({
      name: user.name || name,
      to: normalizedEmail,
    });

    await sendSetPasswordEmail({
      name: user.name || name,
      email: normalizedEmail,
      setPasswordUrl,
    });

    // 4. Create the linked Contact
    const newContact = await Contact.create({
      agentId,
      name,
      email: normalizedEmail,
      phone,
      notes,
      userId: user._id, // Link to the newly created user
    });

    // Increment lead count if caller is an agent
    if (agent.role === "agent") {
      await User.findByIdAndUpdate(agentId, { $inc: { leadCount: 1 } });
    }

    revalidatePath("/admin/contacts");
    return { success: true, contact: JSON.parse(JSON.stringify(newContact)), user: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.error("Error creating customer account:", error);
    return { success: false, error: error.message || "Failed to create customer account" };
  }
}

export async function deleteContact(contactId: string) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "agent") {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    const agentId = session.user.id;
    const contact = await Contact.findOneAndDelete({ _id: contactId, agentId });

    if (!contact) {
      return { success: false, error: "Lead not found" };
    }

    // Decrement lead count
    await User.findByIdAndUpdate(agentId, { $inc: { leadCount: -1 } });

    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting contact:", error);
    return { success: false, error: error.message || "Failed to delete lead" };
  }
}
