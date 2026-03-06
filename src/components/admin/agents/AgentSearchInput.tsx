"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AgentSearchInputProps {
  defaultValue?: string;
}

export function AgentSearchInput({ defaultValue = "" }: AgentSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleSearch = useCallback(
    (term: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (term.trim()) {
          params.set("search", term.trim());
        } else {
          params.delete("search");
        }
        router.push(`/admin/agents?${params.toString()}`);
      }, 300); // 300ms debounce per Rule 12
    },
    [router, searchParams],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search travel partners..."
        className="pl-8"
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        id="agent-search-input"
      />
    </div>
  );
}
