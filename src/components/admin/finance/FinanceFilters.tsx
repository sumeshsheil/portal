"use client";

import { getAgentsList } from "@/app/admin/(dashboard)/finance/finance-actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths, subYears } from "date-fns";
import { Calendar as CalendarIcon, CalendarRange, Filter, Globe, Users } from "lucide-react";
import { useEffect, useState } from "react";

const QUICK_PRESETS = [
  { value: "current_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "last_3_months", label: "3 Months" },
  { value: "last_6_months", label: "6 Months" },
  { value: "year", label: "This Year" },
  { value: "last_year", label: "Last Year" },
  { value: "all_time", label: "All Time" },
] as const;

interface FinanceFiltersProps {
  onFilterChange: (filters: any) => void;
  isAdmin: boolean;
  isAgent?: boolean;
}

export function FinanceFilters({ onFilterChange, isAdmin, isAgent }: FinanceFiltersProps) {
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({
    tripType: "all",
    period: isAgent ? "last_3_months" : "current_month",
    agentId: "all",
  });

  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string>(isAgent ? "last_3_months" : "current_month");

  useEffect(() => {
    if (isAdmin) {
      getAgentsList().then((res) => {
        if (res.success && res.agents) {
          setAgents(res.agents);
        }
      });
    }
  }, [isAdmin]);

  const handleUpdate = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (filters.period === "custom" && fromDate) {
      onFilterChange({
        ...newFilters,
        dateFrom: fromDate.toISOString(),
        dateTo: toDate?.toISOString(),
      });
    } else {
      onFilterChange(newFilters);
    }
  };

  const applyDates = (from: Date | undefined, to: Date | undefined) => {
    setFromDate(from);
    setToDate(to);
    if (from) {
      const newFilters = {
        ...filters,
        period: "custom" as string,
        dateFrom: from.toISOString(),
        dateTo: to?.toISOString(),
      };
      setFilters(prev => ({ ...prev, period: "custom" }));
      onFilterChange(newFilters);
    }
  };

  const applyPreset = (presetValue: string) => {
    const now = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    switch (presetValue) {
      case "current_month":
        from = startOfMonth(now); to = endOfMonth(now); break;
      case "last_month":
        from = startOfMonth(subMonths(now, 1)); to = endOfMonth(subMonths(now, 1)); break;
      case "last_3_months":
        from = subMonths(now, 3); to = now; break;
      case "last_6_months":
        from = subMonths(now, 6); to = now; break;
      case "year":
        from = startOfYear(now); to = now; break;
      case "last_year":
        from = startOfYear(subYears(now, 1)); to = endOfYear(subYears(now, 1)); break;
      case "all_time":
        setActivePreset(presetValue);
        setFromDate(undefined); setToDate(undefined);
        setFilters(prev => ({ ...prev, period: "all_time" }));
        onFilterChange({ ...filters, period: "all_time" });
        setIsCalendarOpen(false);
        return;
    }

    if (from) {
      setActivePreset(presetValue);
      setFromDate(from);
      setToDate(to);
      setFilters(prev => ({ ...prev, period: "custom" }));
      onFilterChange({ ...filters, period: "custom", dateFrom: from.toISOString(), dateTo: to?.toISOString() });
      setIsCalendarOpen(false);
    }
  };

  const getDisplayLabel = () => {
    if (activePreset) {
      const preset = QUICK_PRESETS.find(p => p.value === activePreset);
      if (preset) {
        if (fromDate && toDate) {
          return `${preset.label} (${format(fromDate, "dd MMM")} – ${format(toDate, "dd MMM yyyy")})`;
        }
        return preset.label;
      }
    }
    if (fromDate) {
      if (toDate) return `${format(fromDate, "dd MMM yyyy")} – ${format(toDate, "dd MMM yyyy")}`;
      return `From ${format(fromDate, "dd MMM yyyy")}`;
    }
    return "Select Date Range";
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500 mr-2">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-semibold uppercase tracking-wider">Filters:</span>
      </div>

      {/* Trip Type Filter */}
      <div className="flex flex-col gap-1.5 min-w-[140px]">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
          <Globe className="h-3 w-3" /> Trip Type
        </label>
        <Select value={filters.tripType} onValueChange={(v) => handleUpdate("tripType", v)}>
          <SelectTrigger className="h-9 rounded-lg border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trips</SelectItem>
            <SelectItem value="domestic">Domestic</SelectItem>
            <SelectItem value="international">International</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Picker - Admin Only */}
      {!isAgent && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
            <CalendarRange className="h-3 w-3" /> Date Range
          </label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 justify-start text-left font-normal rounded-lg border-slate-200 dark:border-slate-800 min-w-[180px]",
                  !fromDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate text-xs font-medium">{getDisplayLabel()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
              <div className="flex flex-col sm:flex-row">
                {/* Left Side: Two Calendars (From & To) */}
                <div className="flex flex-col sm:flex-row gap-0">
                  {/* From Calendar */}
                  <div className="p-2 pb-1">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase mb-0.5 px-1 tracking-wider text-center">From</p>
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => {
                        setActivePreset("");
                        setFromDate(date);
                        if (date) applyDates(date, toDate);
                      }}
                      captionLayout="dropdown"
                      disabled={{ after: toDate || new Date() }}
                      fromYear={2020}
                      toYear={new Date().getFullYear()}
                      className="[--cell-size:--spacing(6)]"
                    />
                  </div>
                  {/* To Calendar */}
                  <div className="p-2 pb-1 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase mb-0.5 px-1 tracking-wider text-center">To</p>
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => {
                        setActivePreset("");
                        setToDate(date);
                        if (fromDate) applyDates(fromDate, date);
                      }}
                      captionLayout="dropdown"
                      disabled={{ before: fromDate, after: new Date() }}
                      fromYear={2020}
                      toYear={new Date().getFullYear()}
                      className="[--cell-size:--spacing(6)]"
                    />
                  </div>
                </div>

                {/* Right Side: Shortcuts */}
                <div className="border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 py-3 px-1.5 w-[90px] shrink-0">
                  <p className="text-[8px] font-bold text-slate-400 uppercase mb-1.5 px-1.5 tracking-tighter">Quick</p>
                  <div className="space-y-px">
                    {QUICK_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => applyPreset(preset.value)}
                        className={cn(
                          "w-full text-left px-2 py-1 rounded text-[10px] font-medium transition-colors leading-tight",
                          activePreset === preset.value
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold"
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Agent Filter - Only for Admins */}
      {isAdmin && (
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
            <Users className="h-3 w-3" /> Agent
          </label>
          <Select value={filters.agentId} onValueChange={(v) => handleUpdate("agentId", v)}>
            <SelectTrigger className="h-9 rounded-lg border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isAgent && (
        <div className="hidden md:flex flex-col gap-1.5 ml-auto">
          <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase">View Mode</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Default: Last 3 Months</p>
          </div>
        </div>
      )}
    </div>
  );
}
