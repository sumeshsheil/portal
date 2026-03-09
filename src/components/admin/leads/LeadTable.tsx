"use client";

import { bulkAssignAgents } from "@/app/admin/(dashboard)/leads/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import { Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Agent {
  _id: string;
  name: string;
  email: string;
}

interface LeadListItem {
  _id: string;
  travelers?: Array<{ name?: string; phone?: string; email?: string }>;
  destination?: string;
  tripType?: string;
  guests?: number;
  budget?: number;
  stage: string;
  source?: string;
  agentId?: { _id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface LeadTableProps {
  leads: LeadListItem[];
  agents: Agent[];
  isAdmin: boolean;
}

export function LeadTable({ leads, agents, isAdmin }: LeadTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const router = useRouter();

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "new":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "booked":
        return "bg-green-100 text-green-700 border-green-200";
      case "proposal_sent":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "negotiation":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "won":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "dropped":
        return "bg-red-100 text-red-700 border-red-200";
      case "abandoned":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const toggleAll = () => {
    const activeLeads = leads.filter((l) => l.stage !== "won");
    if (selectedIds.length === activeLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(activeLeads.map((l) => l._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleBulkAssign = async (agentId: string) => {
    if (selectedIds.length === 0) return;

    setIsAssigning(true);
    const result = await bulkAssignAgents(selectedIds, agentId);
    setIsAssigning(false);

    if (result.success) {
      toast.success(result.message);
      setSelectedIds([]);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && isAdmin && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-3 rounded-lg flex items-center justify-between sticky top-0 z-10 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700"
            >
              {selectedIds.length} Selected
            </Badge>
            <span className="text-sm font-medium">Bulk Actions:</span>
          </div>

          <div className="flex items-center gap-2">
            <Select onValueChange={handleBulkAssign} disabled={isAssigning}>
              <SelectTrigger className="w-[200px] h-9 bg-background">
                <Users className="mr-2 h-4 w-4 text-emerald-600" />
                <SelectValue placeholder="Assign to Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="unassigned"
                  className="italic text-muted-foreground"
                >
                  Unassign
                </SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent._id} value={agent._id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
              disabled={isAssigning}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              {isAdmin && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedIds.length === leads.length && leads.length > 0
                    }
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              <TableHead>Traveler</TableHead>
              <TableHead>Trip Details</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 7 : 6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No inquiries found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow
                  key={lead._id}
                  className={
                    selectedIds.includes(lead._id)
                      ? "bg-emerald-50/30 dark:bg-emerald-950/5"
                      : ""
                  }
                >
                  {isAdmin && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(lead._id)}
                        onCheckedChange={() => toggleSelect(lead._id)}
                        disabled={lead.stage === "won"}
                        aria-label={`Select ${lead.travelers?.[0]?.name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-base">
                        {lead.travelers?.[0]?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {lead.travelers?.[0]?.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.destination}</span>
                      <span className="text-xs text-muted-foreground">
                        {lead.tripType} • {lead.guests} guests •{" "}
                        {lead.budget
                          ? `₹${lead.budget.toLocaleString("en-IN")}`
                          : "No Budget"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`capitalize border ${getStageColor(lead.stage)}`}
                    >
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
                  </TableCell>
                  <TableCell>
                    {lead.agentId ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px]">
                            {(lead.agentId.name || "A")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{lead.agentId.name}</span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground border-dashed"
                      >
                        Unassigned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(lead.createdAt), "h:mm a, MMM d")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/leads/${lead._id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
