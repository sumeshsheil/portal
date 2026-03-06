"use client";

import { useEffect, useState, useTransition } from "react";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Wallet,
  IndianRupee,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FinanceFilters } from "@/components/admin/finance/FinanceFilters";
import { getFinanceStats, type FinanceStats, type FinanceFilters as FilterType } from "./finance-actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function FinancePage() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [stats, setStats] = useState<FinanceStats>({
    totalSales: 0,
    totalNet: 0,
    totalEarning: 0,
    totalPaid: 0,
  });

  const isAdmin = session?.user?.role === "admin";
  const isAgent = session?.user?.role === "agent";

  const fetchStats = (filters: FilterType) => {
    startTransition(async () => {
      const res = await getFinanceStats(filters);
      if (res.success && res.stats) {
        setStats(res.stats);
      } else {
        toast.error(res.error || "Failed to fetch financial data");
      }
    });
  };

  useEffect(() => {
    // Initial fetch with default filters
    fetchStats({
      tripType: "all",
      period: isAgent ? "last_3_months" : "current_month",
      agentId: "all",
    });
  }, [isAgent]);

  const cards = [
    {
      title: "Total Sales",
      value: stats.totalSales.toString(),
      subtitle: "From platform (Won leads)",
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Net Amount",
      value: `₹${stats.totalNet.toLocaleString("en-IN")}`,
      subtitle: "Actual trip costs incurred",
      icon: DollarSign,
      color: "text-slate-600",
      bg: "bg-slate-50",
    },
    {
      title: "Total Earning",
      value: `₹${stats.totalEarning.toLocaleString("en-IN")}`,
      subtitle: "Absolute platform profit",
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Paid",
      value: `₹${stats.totalPaid.toLocaleString("en-IN")}`,
      subtitle: "Actual cash verified",
      icon: Wallet,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Finance & Earnings
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {isAdmin 
              ? "Monitor your platform's financial health and global growth metrics."
              : "Track your personal financial performance and earnings history."}
          </p>
        </div>
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
            Refreshing data...
          </div>
        )}
      </div>

      <FinanceFilters 
        onFilterChange={fetchStats} 
        isAdmin={isAdmin} 
        isAgent={isAgent}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg} dark:bg-slate-800 ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-black ${card.color} dark:text-white`}>
                {card.value}
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAgent && (
        <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
            <span className="font-bold">Note:</span> Your view is restricted to the last 3 months of financial activity as per policy.
          </p>
        </div>
      )}

      {/* Decorative Chart Placeholder */}
      <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Performance Visualization</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border-2 border-dashed border-slate-100 dark:border-slate-800 m-6">
          <div className="text-center">
            <TrendingUp className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium italic">
              Detailed financial charts will appear here as more data is collected
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
