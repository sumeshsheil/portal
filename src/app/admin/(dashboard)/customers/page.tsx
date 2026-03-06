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
import { AgentSearchInput } from "@/components/admin/agents/AgentSearchInput"; // Reusing search input
import { ExportCustomersButton } from "@/components/admin/customers/ExportCustomersButton";

export const metadata: Metadata = {
  title: "Leads | Budget Travel Packages",
  description: "View and manage registered leads",
};

interface CustomersPageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  // 1. Verify admin access
  await verifyAdmin();

  // 2. Connect to database
  await connectDB();

  // 3. Parse search parameters
  const params = await searchParams;
  const search = params.search || "";
  const statusFilter = params.status || "all";

  // 4. Build query
  interface CustomerQuery {
    role: string;
    status?: string;
    $or?: Array<Record<string, unknown>>;
  }

  const query: CustomerQuery = { role: "customer" };

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

  // 5. Fetch customers
  const customers = (await User.find(query)
    .sort({ createdAt: -1 })
    .lean()) as unknown as IUser[];

  const exportData = customers.map((c) => ({
    _id: c._id.toString(),
    name: c.name,
    email: c.email,
    phone: c.phone || "",
    status: c.status,
    createdAt: c.createdAt.toString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <p className="text-muted-foreground">
            A list of all users registered as leads.
          </p>
        </div>
        <ExportCustomersButton customers={exportData} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead List</CardTitle>
          <CardDescription>
            Showing {customers.length}{" "}
            {customers.length === 1 ? "lead" : "leads"}
            {search && ` matching "${search}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Suspense fallback={null}>
              {/* Reusing the AgentSearchInput as it just updates the ?search= parameter in URL */}
              <AgentSearchInput defaultValue={search} />
            </Suspense>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Joined Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {search
                        ? `No leads found matching "${search}".`
                        : "No leads found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer._id.toString()}>
                      <TableCell
                        className="font-medium max-w-[150px] truncate"
                        title={customer.name}
                      >
                        {customer.name}
                        {customer.isVerified && (
                          <Badge
                            variant="outline"
                            className="ml-2 bg-emerald-50 text-emerald-600 border-emerald-200 py-0 h-4 text-[10px]"
                          >
                            Verified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={customer.email}
                      >
                        {customer.email}
                      </TableCell>
                      <TableCell className="capitalize">
                        {customer.gender || "-"}
                      </TableCell>
                      <TableCell>
                        {customer.birthDate
                          ? format(new Date(customer.birthDate), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>{customer.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            customer.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            customer.status === "active"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-100/80 border-slate-200"
                          }
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell whitespace-nowrap">
                        {format(new Date(customer.createdAt), "MMM d, yyyy")}
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
