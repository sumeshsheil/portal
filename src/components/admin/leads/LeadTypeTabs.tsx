"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Globe, Home, LayoutDashboard } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function LeadTypeTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentType = searchParams.get("type") || "all";

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    // Reset page when changing type
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentType} onValueChange={handleTypeChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Inquiry Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>All Inquiries</span>
          </div>
        </SelectItem>
        <SelectItem value="domestic">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Domestic</span>
          </div>
        </SelectItem>
        <SelectItem value="international">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>International</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
