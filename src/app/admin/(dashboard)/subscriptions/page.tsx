import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { verifyAdmin } from "@/lib/auth-check";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import type { Metadata } from "next";
import { SubscriptionRequestActions } from "./SubscriptionRequestActions";

export const metadata: Metadata = {
  title: "Subscription Management | Admin",
  description: "Manage agent subscription requests",
};

export default async function SubscriptionsPage() {
  await verifyAdmin();
  await connectDB();

  const pendingRequests = await User.find({
    role: "agent",
    subscriptionStatus: "pending",
  }).sort({ updatedAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Subscription Requests</h2>
        <p className="text-muted-foreground">
          Approve or reject agent requests for Pro plan upgrades.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            Agents who have submitted their payment and are waiting for approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Requested Plan</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No pending subscription requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((request: any) => (
                    <TableRow key={request._id.toString()}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-600 border-none">
                          {request.plan?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {request.billingCycle || "N/A"}
                      </TableCell>
                      <TableCell>
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                          {request.transactionId || "N/A"}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        <SubscriptionRequestActions 
                          agentId={request._id.toString()}
                          plan={request.plan}
                          billingCycle={request.billingCycle}
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
    </div>
  );
}
