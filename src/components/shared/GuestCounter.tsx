"use client";

import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface GuestCounterProps {
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  error?: string;
  className?: string;
  useFormControl?: boolean;
}

export const GuestCounter: React.FC<GuestCounterProps> = ({
  value,
  onChange,
  onBlur,
  min = 1,
  max = 30,
  error,
  className,
  useFormControl = false,
}) => {
  const guestCount = typeof value === "string" ? parseInt(value) || 0 : value;

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (guestCount > min) {
      onChange(String(guestCount - 1));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (guestCount < max) {
      onChange(String(guestCount + 1));
    }
  };

  const content = (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border shadow-sm rounded-lg p-1 transition-all h-11",
        error
          ? "border-red-500 ring-red-500/10"
          : "border-slate-200 dark:border-slate-800 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/40",
        "bg-slate-50/50 dark:bg-slate-900/50",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 shrink-0 transition-all active:scale-95"
        onClick={handleDecrement}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <div className="flex-1 text-center">
        <Input
          type="number"
          className="h-8 border-none bg-transparent text-center font-bold text-lg text-slate-900 dark:text-white focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full p-0"
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (e.target.value === "") onChange("");
            else if (!isNaN(val) && val >= 0 && val <= max)
              onChange(String(val));
          }}
          onBlur={() => {
            if (onBlur) onBlur();
            if (!value || parseInt(String(value)) < min) onChange(String(min));
          }}
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 shrink-0 transition-all active:scale-95"
        onClick={handleIncrement}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );

  return useFormControl ? <FormControl>{content}</FormControl> : content;
};
