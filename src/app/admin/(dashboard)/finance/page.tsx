"use client";

import {
    AlertCircle, Briefcase, DollarSign, IndianRupee,
    Loader2, Wallet
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { AgentPayoutList } from "@/components/admin/finance/AgentPayoutList";
import { FinanceFilters } from "@/components/admin/finance/FinanceFilters";
import { RequestPayoutDialog } from "@/components/admin/finance/RequestPayoutDialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getAgentPayoutBalance, getFinanceStats, type FinanceFilters as FilterType, type FinanceStats, type PayoutBalance } from "./finance-actions";

export default function FinancePage() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [stats, setStats] = useState<FinanceStats>({
    wonCount: 0,
    totalNet: 0,
    totalEarning: 0,
    totalRevenue: 0,
  });
  const [balance, setBalance] = useState<PayoutBalance>({
    totalEarnings: 0,
    pendingPayouts: 0,
    paidAmount: 0,
    availableToPayout: 0,
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

  const fetchBalance = async () => {
    if (isAgent) {
      const res = await getAgentPayoutBalance();
      if (res.success && res.balance) {
        setBalance(res.balance);
      }
    }
  };

  useEffect(() => {
    // Initial fetch with default filters
    fetchStats({
      tripType: "all",
      period: isAgent ? "last_3_months" : "current_month",
      agentId: "all",
    });
    fetchBalance();

    const handleUpdate = () => {
      fetchBalance();
      // Also refresh stats to ensure everything is in sync
      fetchStats({
        tripType: "all",
        period: "all_time", // Refreshing all time stats to be sure
        agentId: "all",
      });
    };

    window.addEventListener("payout-updated", handleUpdate);
    return () => window.removeEventListener("payout-updated", handleUpdate);
  }, [isAgent]);

  const cards = [
    {
      title: "Total Sales",
      value: stats.wonCount.toString(),
      subtitle: "Successfully sold leads count",
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Net",
      value: `₹${stats.totalNet.toLocaleString("en-IN")}`,
      subtitle: "Realized cost from verified payments",
      icon: DollarSign,
      color: "text-slate-600",
      bg: "bg-slate-50",
    },
    {
      title: "Total Profit",
      value: `₹${stats.totalEarning.toLocaleString("en-IN")}`,
      subtitle: "Realized profit from verified payments",
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      subtitle: "Total verified client payments",
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
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1 h-fit border-0 shadow-2xl bg-linear-to-br from-emerald-600 to-emerald-800 dark:from-emerald-950 dark:to-emerald-900 text-white overflow-hidden relative ring-1 ring-white/10">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none rotate-12">
              <Wallet className="h-40 w-40" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-emerald-100/60 text-[10px] font-black uppercase tracking-[0.2em]">Available for Payout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-1">
                <div className="text-5xl font-black tracking-tight drop-shadow-sm">
                  ₹{balance.availableToPayout.toLocaleString()}
                </div>
                <p className="text-emerald-100/40 text-[9px] font-bold uppercase tracking-widest">
                  Verified earnings only
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-100/50">In Review</p>
                  <p className="text-lg font-black tracking-tight">₹{balance.pendingPayouts.toLocaleString()}</p>
                </div>
                <div className="space-y-1 border-l border-white/10 pl-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-100/50">Total Paid</p>
                  <p className="text-lg font-black tracking-tight">₹{balance.paidAmount.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-2">
                <RequestPayoutDialog availableBalance={balance.availableToPayout} />
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <AgentPayoutList />
          </div>
        </div>
      )}

      {isAgent && (
        <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
            <span className="font-bold">Note:</span> Your view is restricted to the last 3 months of financial activity as per policy. Earnings are only available for payout once a lead is marked as Won or Dropped.
          </p>
        </div>
      )}


    </div>
  );
}
