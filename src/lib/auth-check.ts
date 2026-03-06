import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "agent";
};

/**
 * Verifies the user is authenticated.
 * Used in Server Components and Server Actions.
 * Redirects to login if not authenticated.
 */
export async function verifySession(): Promise<SessionUser> {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return session.user as SessionUser;
}

/**
 * Verifies the user is an ADMIN.
 * Used for admin-only actions (creating agents, settings).
 * Throws error if not admin (for Server Actions) or redirects (for Pages).
 */
export async function verifyAdmin() {
  const user = await verifySession();

  if (user.role !== "admin") {
    // For Server Actions, we throw
    throw new Error("Unauthorized: Admin access required");
  }

  return user;
}
