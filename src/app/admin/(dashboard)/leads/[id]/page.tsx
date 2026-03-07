import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Users,
  AlertTriangle,
} from "lucide-react";

import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
import { auth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ActionButtons } from "@/components/admin/leads/lead-detail/ActionButtons";
import { ActivityTimeline } from "@/components/admin/leads/lead-detail/ActivityTimeline";
import { DocumentManager } from "@/components/admin/leads/lead-detail/DocumentManager";
import { ItineraryManager } from "@/components/admin/leads/lead-detail/ItineraryManager";
import { TripInfoManager } from "@/components/admin/leads/lead-detail/TripInfoManager";
import { PaymentManager } from "@/components/admin/leads/lead-detail/PaymentManager";
import { AgentIdentityCard } from "@/components/admin/leads/lead-detail/AgentIdentityCard";
import { CustomerHistoryCard } from "@/components/admin/leads/lead-detail/CustomerHistoryCard";
import { LeadCommentsCard } from "@/components/admin/leads/lead-detail/LeadCommentsCard";
import { CopyableBadge } from "@/components/admin/leads/lead-detail/CopyableBadge";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLeadActivities } from "./activity-actions";

interface PopulatedAgent {
  _id: { toString: () => string };
  name: string;
  email: string;
}

interface TravelerData {
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  memberId?: string;
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) return notFound();

  await connectDB();
  const { id } = await params;

  // Ensure valid ID format before query
  if (!id.match(/^[0-9a-fA-F]{24}$/)) return notFound();

  const lead = await Lead.findById(id)
    .populate(
      "agentId",
      "name email aadhaarNumber passportNumber panNumber documents isVerified",
    )
    .populate(
      "customerId",
      "aadhaarNumber passportNumber panNumber documents members",
    )
    .lean();

  if (!lead) return notFound();

  // Access Control: Agents can only view their own leads
  if (
    session.user.role === "agent" &&
    lead.agentId?._id?.toString() !== session.user.id
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">
          You are not authorized to view this lead details.
        </p>
        <Button asChild>
          <Link href="/admin/leads">Return to Inquiries</Link>
        </Button>
      </div>
    );
  }

  // Fetch agents for assignment (Admin only)
  let agents: Array<{ _id: string; name: string; email: string }> = [];
  if (session.user.role === "admin") {
    const rawAgents = await User.find({
      role: "agent",
      status: "active",
      isVerified: true,
    })
      .select("name email _id")
      .lean();
    agents = rawAgents.map((a) => ({
      _id: String(a._id),
      name: a.name,
      email: a.email,
    }));
  }

  // Fetch previous leads for this customer (Admin only)
  let previousLeads: any[] = [];
  if (session.user.role === "admin" && lead.customerId) {
    previousLeads = await Lead.find({
      customerId: (lead.customerId as any)._id,
      _id: { $ne: lead._id },
    })
      .select("destination travelDate stage createdAt")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  }

  // Fetch activities
  const activities = await getLeadActivities(String(lead._id));

  // Serialize trip details for client components
  const documents = JSON.parse(JSON.stringify(lead.documents || []));
  const itinerary = JSON.parse(JSON.stringify(lead.itinerary || []));
  const inclusions = (lead.inclusions || []) as string[];
  const exclusions = (lead.exclusions || []) as string[];
  const leadId = String(lead._id);

  // Requirement check for 'Mark as Won'
  const isReadyToWin =
    (lead.tripCost || 0) > 0 &&
    (itinerary.length > 0 || !!lead.itineraryPdfUrl) &&
    (documents.length > 0 || !!lead.travelDocumentsPdfUrl) &&
    lead.paymentStatus === "paid";

  // Fetch ALL leads for this customer to calculate aggregate stats (Admin only)
  let customerHistoryData = null;
  if (session.user.role === "admin" && lead.customerId) {
    const customerId = (lead.customerId as any)._id || lead.customerId;
    const allCustomerLeads = await Lead.find({
      customerId: customerId,
    })
      .select("stage tripProfit")
      .lean();

    customerHistoryData = allCustomerLeads.reduce(
      (acc, l) => {
        acc.totalLeads++;
        if (l.stage === "won") acc.wonTrips++;
        if (l.stage === "dropped") acc.lostTrips++;
        if (l.tripProfit) acc.totalEarnings += l.tripProfit;
        return acc;
      },
      { totalLeads: 0, wonTrips: 0, lostTrips: 0, totalEarnings: 0 },
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0 mt-1 h-8 w-8">
          <Link href="/admin/leads">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
              {lead.travelers?.[0]?.name || "Unknown Traveler"}
            </h1>
            <Badge variant="outline" className="capitalize w-fit text-[10px] sm:text-xs">
              {lead.stage === "new"
                ? "Inquiry Received"
                : lead.stage === "contacted"
                  ? "Under Review"
                  : lead.stage === "proposal_sent"
                    ? "Proposal Ready"
                    : lead.stage === "negotiation"
                      ? "Finalizing"
                      : lead.stage === "won"
                        ? "Trip Confirmed"
                        : lead.stage.replace("_", " ")}
            </Badge>
          </div>
          <div className="text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-2 text-xs sm:text-sm mt-1.5">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{lead.destination}</span>
            </div>
            <span className="hidden sm:inline text-slate-300 mx-1">|</span>
            <span className="truncate text-[10px] sm:text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded sm:bg-transparent sm:p-0">
              ID: {lead._id.toString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Overview Switchable Component */}
          <TripInfoManager
            leadId={leadId}
            tripType={lead.tripType}
            destination={lead.destination}
            departureCity={lead.departureCity}
            travelDate={lead.travelDate}
            duration={lead.duration}
            guests={lead.guests}
            budget={lead.budget}
            netAmount={lead.netAmount}
            tripCost={lead.tripCost}
            tripProfit={lead.tripProfit}
            specialRequests={lead.specialRequests}
          />

          {/* Travelers Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Traveler Information
                </CardTitle>
                <CardDescription>
                  {lead.travelers?.length || 0} of {lead.guests} records present
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {lead.guests > (lead.travelers?.length || 0) && (
                <Alert
                  variant="destructive"
                  className="bg-amber-50 dark:bg-amber-200 border-amber-200 dark:border-amber-400 text-amber-800 dark:text-amber-900"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-900" />
                  <AlertTitle>Missing Traveler Details</AlertTitle>
                  <AlertDescription>
                    Trip is for {lead.guests} people, but only{" "}
                    {lead.travelers?.length || 0} traveler(s) are recorded.
                  </AlertDescription>
                </Alert>
              )}

              {lead.travelers && lead.travelers.length > 0 ? (
                lead.travelers.map((traveler: TravelerData, idx: number) => (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-muted/50 p-4 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{traveler.name}</p>
                        <Badge
                          variant={idx === 0 ? "default" : "secondary"}
                          className={cn(
                            "text-[10px] h-5",
                            idx === 0 && "bg-emerald-500 hover:bg-emerald-600 text-black border-none"
                          )}
                        >
                          {idx === 0 ? "Primary Traveler" : "Companion"}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {traveler.gender}, {traveler.age}yo
                      </Badge>
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Email:</span>
                        {traveler.email ? (
                          <a
                            href={`mailto:${traveler.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {traveler.email}
                          </a>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            Not provided
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Phone:</span>
                        {traveler.phone ? (
                          <a
                            href={`tel:${traveler.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {traveler.phone}
                          </a>
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            Not provided
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Traveler Identity Documents (New) */}
                    {(() => {
                      const customer = lead.customerId as any;
                      let personDocs: any = null;
                      const t = traveler as any;
                      let personAadhaar = t.aadhaarNumber || "";
                      let personPassportNumber = t.passportNumber || "";
                      let personPan = t.panNumber || "";

                      if (idx === 0 && customer) {
                        // Primary traveler is usually the customer
                        personDocs = customer.documents;
                        personAadhaar =
                          personAadhaar || customer.aadhaarNumber || "";
                        personPassportNumber =
                          personPassportNumber || customer.passportNumber || "";
                        personPan = personPan || customer.panNumber || "";
                      } else if (t.memberId && customer?.members) {
                        // Companion linked to a member
                        const member = customer.members.find(
                          (m: any) =>
                            m._id?.toString() === t.memberId ||
                            m.id?.toString() === t.memberId,
                        );
                        if (member) {
                          personDocs = member.documents;
                          personAadhaar =
                            personAadhaar || member.aadhaarNumber || "";
                          personPassportNumber =
                            personPassportNumber || member.passportNumber || "";
                          // For members, PAN might be in documents
                        }
                      }

                      const tDocs = t.documents || {};

                      // Check if any documents exist in the nested structure
                      const hasAadhaar =
                        personDocs?.aadharCard?.length > 0 ||
                        tDocs.aadharCard?.length > 0;
                      const hasPassport =
                        personDocs?.passport?.length > 0 ||
                        tDocs.passport?.length > 0;
                      const hasPan =
                        personDocs?.panCard?.length > 0 ||
                        tDocs.panCard?.length > 0;

                      // Also support legacy or simplified document formats if they exist
                      const aadhaarUrl =
                        tDocs.aadharCard?.[0] ||
                        personDocs?.aadharCard?.[0] ||
                        null;
                      const passportUrl =
                        tDocs.passport?.[0] ||
                        personDocs?.passport?.[0] ||
                        null;
                      const panUrl =
                        tDocs.panCard?.[0] || personDocs?.panCard?.[0] || null;

                      if (
                        !personAadhaar &&
                        !personPassportNumber &&
                        !personPan &&
                        !hasAadhaar &&
                        !hasPassport &&
                        !hasPan
                      ) {
                        // For companions (not primary), show a warning
                        if (idx > 0) {
                          return (
                            <>
                              <Separator className="my-2" />
                              <div className="space-y-2">
                                <p className="text-[10px] font-medium text-muted-foreground uppercase">
                                  Identity Documents
                                </p>
                                <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md px-2.5 py-1.5">
                                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                  <span className="text-[11px] font-medium">
                                    No Aadhaar or Passport uploaded
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        }
                        return null;
                      }

                      return (
                        <>
                          <Separator className="my-2" />
                          <div className="space-y-2">
                            <p className="text-[10px] font-medium text-muted-foreground uppercase">
                              Identity Documents (View Only)
                            </p>
                            <div className="flex flex-wrap gap-2 text-[10px]">
                              {(personAadhaar || hasAadhaar) && (
                                <CopyableBadge
                                  label="Aadhaar"
                                  value={personAadhaar}
                                  url={aadhaarUrl}
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100"
                                />
                              )}
                              {(personPassportNumber || hasPassport) && (
                                <CopyableBadge
                                  label="Passport"
                                  value={personPassportNumber}
                                  url={passportUrl}
                                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100"
                                />
                              )}
                              {(personPan || hasPan) && (
                                <CopyableBadge
                                  label="PAN"
                                  value={personPan}
                                  url={panUrl}
                                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100"
                                />
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic">
                  No traveler details available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Customer History Summary (Admin Only) */}
          {customerHistoryData && (
            <CustomerHistoryCard history={customerHistoryData} />
          )}

          {/* Itinerary Manager (PDF Only) */}
          <ItineraryManager
            leadId={leadId}
            itineraryPdfUrl={lead.itineraryPdfUrl}
          />

          {/* Payment Manager */}
          <PaymentManager
            leadId={leadId}
            payments={JSON.parse(JSON.stringify(lead.bookingPayments || []))}
            tripCost={lead.tripCost || 0}
            paymentStatus={lead.paymentStatus}
            customerEmail={lead.travelers?.[0]?.email}
            isAdmin={session.user.role === "admin"}
          />

          {/* Documents Manager */}
          <DocumentManager
            leadId={leadId}
            travelDocumentsPdfUrl={lead.travelDocumentsPdfUrl}
          />
        </div>

        {/* Right Column - Actions */}
        {/* Right Column - Status, Activity, Actions */}
        <div className="space-y-6">
          <ActionButtons
            leadId={lead._id.toString()}
            currentStage={lead.stage}
            currentAgentId={lead.agentId?._id?.toString()}
            agents={JSON.parse(JSON.stringify(agents))}
            isAdmin={session.user.role === "admin"}
            isReadyToWin={isReadyToWin}
            currentUserId={session.user.id}
          />
          {/* QuickActions component is not in the original code, adding it as per instruction snippet */}
          {/* Assuming 'lead' and 'isAdmin' are available in scope */}
          {/* <QuickActions lead={lead} /> */}

          <LeadCommentsCard
            leadId={leadId}
            comments={JSON.parse(JSON.stringify(lead.comments || []))}
            disabled={
              !(session.user.role === "admin") &&
              lead.agentId?._id.toString() !== session.user.id
            }
          />

          {/* Agent Identity Card (Admin Only) */}
          {lead.agentId && session.user.role === "admin" && (
            <AgentIdentityCard
              agent={JSON.parse(JSON.stringify(lead.agentId))}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Inquiry Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="capitalize font-medium">
                  {lead.source.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(lead.createdAt), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Activity</span>
                <span>
                  {format(new Date(lead.lastActivityAt), "MMM d, HH:mm")}
                </span>
              </div>
              {lead.agentId && (
                <div className="pt-2 border-t mt-2">
                  <p className="text-muted-foreground mb-1">Assigned Agent</p>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                      {(
                        (lead.agentId as unknown as PopulatedAgent)?.name ||
                        "AG"
                      )
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                    <span className="font-medium">
                      {(lead.agentId as unknown as PopulatedAgent)?.name ||
                        "Unknown Agent"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline (Admin Only) */}
          {session.user.role === "admin" && (
            <div className="space-y-6">
              {/* Previous Bookings */}
              {previousLeads.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Booking History
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Customer's previous travel history
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {previousLeads.map((prev: any) => (
                        <Link
                          key={prev._id.toString()}
                          href={`/admin/leads/${prev._id}`}
                          className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate">
                              {prev.destination}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {prev.travelDate}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-[10px] h-5 capitalize"
                          >
                            {prev.stage === "new"
                              ? "Inquiry Received"
                              : prev.stage === "contacted"
                                ? "Under Review"
                                : prev.stage === "proposal_sent"
                                  ? "Proposal Ready"
                                  : prev.stage === "negotiation"
                                    ? "Finalizing"
                                    : prev.stage === "won"
                                      ? "Trip Confirmed"
                                      : prev.stage.replace("_", " ")}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Activity History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline activities={activities} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
