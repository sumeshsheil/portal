"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ViewToggle() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const view = searchParams.get("view") || "board";

  useEffect(() => {
    // Initial check for screen size on mount and view change
    const checkViewport = () => {
      const isSmallScreen = window.innerWidth < 1024; // lg breakpoint in Tailwind
      if (isSmallScreen && searchParams.get("view") !== "board") {
        const params = new URLSearchParams(searchParams);
        params.set("view", "board");
        params.delete("stage");
        replace(`${pathname}?${params.toString()}`);
      }
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, [searchParams, pathname, replace]);

  const handleViewChange = (newView: string) => {
    if (!newView) return; // Prevent unselecting
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    if (newView === "board") {
      params.delete("stage");
    }
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
