"use client";

import { useState } from "react";
import { Copy, Check, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyableBadgeProps {
  label: string;
  value: string;
  url?: string | null;
  className?: string;
}

export function CopyableBadge({
  label,
  value,
  url,
  className,
}: CopyableBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value || value === "Uploaded") return;

    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasValue = value && value !== "Uploaded";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1 font-normal py-0.5 pr-1 transition-all duration-200 group",
        className,
      )}
    >
      <FileText className="h-3 w-3 shrink-0" />
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline flex items-center gap-1"
        >
          {label}: {value || "Uploaded"}
        </a>
      ) : (
        <span>
          {label}: {value}
        </span>
      )}

      {hasValue && (
        <button
          type="button"
          onClick={handleCopy}
          className="ml-1 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          title={`Copy ${label}`}
        >
          {copied ? (
            <Check className="h-2.5 w-2.5 text-emerald-600" />
          ) : (
            <Copy className="h-2.5 w-2.5 opacity-40 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      )}
    </Badge>
  );
}
