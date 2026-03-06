"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

import { useSession } from "next-auth/react";

export function LeadFilters() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentStage = searchParams.get("stage") || "all";
  const isAdmin = session?.user?.role === "admin";

  const handleStageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set("stage", value);
    } else {
      params.delete("stage");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={currentStage} onValueChange={handleStageChange}>
        <SelectTrigger className="w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="All Stages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="new">Inquiry Received</SelectItem>
          <SelectItem value="contacted">Under Review</SelectItem>
          <SelectItem value="booked">Booked</SelectItem>
          <SelectItem value="proposal_sent">Proposal Ready</SelectItem>
          <SelectItem value="negotiation">Finalizing</SelectItem>
          {isAdmin && <SelectItem value="won">Trip Confirmed</SelectItem>}
          <SelectItem value="dropped">Dropped</SelectItem>
          <SelectItem value="abandoned">Abandoned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
