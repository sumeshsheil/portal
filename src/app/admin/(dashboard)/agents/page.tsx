import type { Metadata } from "next";
import { format } from "date-fns";
import { Suspense } from "react";

import { connectDB } from "@/lib/db/mongoose";
import User, { type IUser } from "@/lib/db/models/User";
import { verifyAdmin } from "@/lib/auth-check";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AgentActions } from "@/components/admin/agents/AgentActions";
import { AgentSearchInput } from "@/components/admin/agents/AgentSearchInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerificationRequestList } from "@/components/admin/agents/VerificationRequestList";

export const metadata: Metadata = {
  title: "Travel Partner Management | Budget Travel Packages",
  description: "Manage travel partners and their permissions",
};

interface AgentsPageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
  await verifyAdmin();
  await connectDB();

  const params = await searchParams;
  const search = params.search || "";
  const statusFilter = params.status || "all";

  // Build query with search and status filters
  interface AgentQuery {
    role: string;
    status?: string;
    $or?: Array<Record<string, unknown>>;
  }

  const query: AgentQuery = { role: "agent" };

  if (statusFilter && statusFilter !== "all") {
    query.status = statusFilter;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const agents = (await User.find(query)
    .sort({ createdAt: -1 })
    .lean()) as unknown as IUser[];

  const pendingRequests = (await User.find({
    role: "agent",
    verificationStatus: "pending",
  })
    .sort({ updatedAt: -1 })
    .lean()) as unknown as any[];

  const subscribedAgents = (await User.find({
    role: "agent",
    plan: "pro",
    subscriptionStatus: "active",
  })
    .sort({ updatedAt: -1 })
    .lean()) as unknown as any[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Travel Partners</h2>
          <p className="text-muted-foreground">
            Manage your team of travel partners and verify their profiles.
          </p>
        </div>
      </div>

      <Tabs defaultValue="verifications" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="verifications" className="relative">
            Verification Requests
            {pendingRequests.length > 0 && (
              <Badge className="ml-2 bg-emerald-600 text-white border-none py-0 px-1.5 h-4 min-w-4 flex items-center justify-center text-[10px]">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscribed Members</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                A list of all registered travel partners who can manage leads.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Suspense fallback={null}>
                  <AgentSearchInput defaultValue={search} />
                </Suspense>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Joined
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          {search
                            ? `No agents found matching "${search}".`
                            : "No agents found. Add your first agent above."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      agents.map((agent) => (
                        <TableRow key={agent._id.toString()}>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span className="flex items-center gap-2">
                                {agent.name}
                                {agent.isVerified && (
                                  <Badge
                                    variant="outline"
                                    className="bg-emerald-50 text-emerald-600 border-emerald-200 py-0 h-4 text-[10px]"
                                  >
                                    Verified
                                  </Badge>
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{agent.email}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                agent.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                agent.status === "active"
                                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200"
                              }
                            >
                              {agent.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {format(new Date(agent.createdAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <AgentActions
                              agent={JSON.parse(JSON.stringify(agent))}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle>Verification Requests</CardTitle>
              <CardDescription>
                Review documents submitted by agents for account verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerificationRequestList
                requests={JSON.parse(JSON.stringify(pendingRequests))}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscribed Members</CardTitle>
              <CardDescription>
                Overview of agents with active Pro subscriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border text-sm">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Expires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribedAgents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          No subscribed members found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      subscribedAgents.map((agent) => (
                        <TableRow key={agent._id.toString()}>
                          <TableCell className="font-bold">{agent.name}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-500 text-white border-none uppercase text-[10px]">
                              {agent.plan}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{agent.billingCycle || "N/A"}</TableCell>
                          <TableCell>
                             <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50">
                               {agent.subscriptionStatus}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {agent.subscriptionEndDate ? format(new Date(agent.subscriptionEndDate), "MMM d, yyyy") : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
