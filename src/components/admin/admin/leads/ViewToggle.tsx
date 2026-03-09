"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ViewToggle() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const view = searchParams.get("view") || "list";

  const handleViewChange = (newView: string) => {
    if (!newView) return; // Prevent unselecting
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={handleViewChange}
      variant="outline"
    >
      <ToggleGroupItem
        value="list"
        aria-label="List View"
        className="data-[state=on]:bg-emerald-600 data-[state=on]:text-white hover:bg-emerald-50 hover:text-emerald-700"
      >
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="board"
        aria-label="Kanban Board"
        className="data-[state=on]:bg-emerald-600 data-[state=on]:text-white hover:bg-emerald-50 hover:text-emerald-700"
      >
        <LayoutGrid className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
