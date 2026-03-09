import { ContactsTable } from "@/components/admin/contacts/ContactsTable";
import { CreateContactDialog } from "@/components/admin/contacts/CreateContactDialog";
import { auth } from "@/lib/auth";
import Contact from "@/lib/db/models/Contact";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads | Budget Travel Packages",
  description: "Manage your personal lead list",
};

const PLAN_LIMITS: Record<string, number> = {
  free: 30,
  basic: 100,
  pro: Infinity,
  premium: Infinity,
  enterprise: Infinity,
};

export default async function ContactsPage() {
  const session = await auth();
  if (!session) return null;

  // Now allowing Admins to view contacts too
  const isAdmin = session.user.role === "admin";
  const agentId = session.user.id;

  await connectDB();

  let contacts = [];
  let plan = "free";
  let limit = 30;
  let leadCount = 0;
  let isEnterprise = false;

  if (isAdmin) {
    contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    limit = Infinity;
    leadCount = contacts.length;
  } else {
    // Agent logic
    const agent = await User.findById(agentId).select("plan leadCount").lean() as any;
    plan = agent?.plan || "free";
    isEnterprise = plan === "enterprise";
    limit = PLAN_LIMITS[plan] || 30;
    contacts = await Contact.find({ agentId }).sort({ createdAt: -1 }).lean();
    leadCount = contacts.length;

    // Auto-sync the leadCount if it's incorrect
    if (agent?.leadCount !== leadCount) {
      await User.updateOne({ _id: agentId }, { $set: { leadCount: leadCount } });
    }
  }

  const serialized = JSON.parse(JSON.stringify(contacts));
  const canAddMore = leadCount < limit;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            {isAdmin ? (
              <span>Manage all system contacts. ({leadCount} total)</span>
            ) : (
              <span>
                Manage your personal lead list. You are on the <span className="font-semibold capitalize">{plan}</span> plan. ({leadCount}/{limit === Infinity ? "Unlimited" : limit})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(!isAdmin) && <CreateContactDialog canAddMore={canAddMore} currentPlan={plan} />}
        </div>
      </div>

      <ContactsTable contacts={serialized} />
    </div>
  );
}

