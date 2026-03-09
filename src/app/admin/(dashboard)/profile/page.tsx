import { AgentProfileForm } from "@/components/admin/profile/AgentProfileForm";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAgentProfile } from "./actions";

export const metadata: Metadata = {
  title: "My Profile | Agent Dashboard",
  description: "Manage your agent profile and verification documents.",
};

export default async function AgentProfilePage() {
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
        <h2 className="text-3xl font-bold tracking-tight">Agent Profile</h2>
        <p className="text-muted-foreground">
          Keep your professional information and identity documents up to date.
        </p>
      </div>

      <AgentProfileForm initialData={profile} />
    </div>
  );
}
