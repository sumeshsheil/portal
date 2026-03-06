"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAgentsList } from "@/app/admin/(dashboard)/finance/finance-actions";
import { Filter, Users, Calendar, Globe } from "lucide-react";

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
    onFilterChange(newFilters);
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

      {/* Period Filter - Restricted for Agents */}
      {!isAgent && (
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
            <Calendar className="h-3 w-3" /> Period
          </label>
          <Select value={filters.period} onValueChange={(v) => handleUpdate("period", v)}>
            <SelectTrigger className="h-9 rounded-lg border-slate-200 dark:border-slate-800 focus:ring-emerald-500/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Current Month</SelectItem>
              <SelectItem value="last_month">Last Month</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="year">Current Year</SelectItem>
            </SelectContent>
          </Select>
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
