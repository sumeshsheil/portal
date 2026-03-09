import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { KeyRound, Mail } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Settings | Budget Travel Packages",
  description: "Manage your account and preferences",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  await connectDB();
  const user = await User.findById(session.user.id).lean();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-emerald-600" />
              Account Information
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Update your personal information and contact details.
            </p>
            <ProfileForm
              initialData={{
                name: user.name,
                email: user.email,
                phone: user.phone || "",
              }}
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-600" />
              Security
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Manage your password and account security.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                  Change your password periodically to keep your account secure.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/admin/change-password">Change Password</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Preferences Section (Mock) */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Notifications
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Manage how you receive alerts (coming soon).
            </p>
            <div className="flex items-center justify-between opacity-50 pointer-events-none">
              <div className="space-y-0.5">
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts for new leads.
                </p>
              </div>
              {/* <Switch checked={false} /> */}
              <div className="h-6 w-11 rounded-full bg-muted border" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
