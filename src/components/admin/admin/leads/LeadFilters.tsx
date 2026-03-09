"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function LeadFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentStage = searchParams.get("stage") || "all";

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
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="contacted">Contacted</SelectItem>
          <SelectItem value="booked">Booked</SelectItem>
          <SelectItem value="proposal_sent">Proposal Sent</SelectItem>
          <SelectItem value="negotiation">Negotiation</SelectItem>
          <SelectItem value="won">Won</SelectItem>
          <SelectItem value="dropped">Dropped</SelectItem>
          <SelectItem value="abandoned">Abandoned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
