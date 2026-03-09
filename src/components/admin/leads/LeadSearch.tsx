"use client";

import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export function LeadSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(
    searchParams.get("search")?.toString() || "",
  );

  // Sync state with URL (e.g. on back/forward navigation)
  useEffect(() => {
    setTerm(searchParams.get("search")?.toString() || "");
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  return (
    <div className="relative flex-1 sm:w-80">
      {isPending ? (
        <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        placeholder="Search by Lead ID..."
        className="pl-8 bg-background"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}
