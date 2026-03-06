import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAgentProfile } from "../profile/actions";
import SubscriptionClient from "./SubscriptionClient";

export const metadata: Metadata = {
  title: "Subscription | Agent Dashboard",
  description: "Manage your agent subscription plan and billing.",
};

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const profile = await getAgentProfile();
  if (!profile) {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Subscription Plan</h2>
        <p className="text-muted-foreground">
          Upgrade your plan to unlock more features and higher lead limits.
        </p>
      </div>

      <SubscriptionClient user={profile} />
    </div>
  );
}
