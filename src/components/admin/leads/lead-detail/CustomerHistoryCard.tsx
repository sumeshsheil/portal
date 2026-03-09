"use client";

import {
    Card,
    CardContent, CardDescription, CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    CheckCircle2, History, IndianRupee, TrendingUp,
    XCircle
} from "lucide-react";

interface CustomerHistory {
  totalLeads: number;
  wonTrips: number;
  lostTrips: number;
  totalEarnings: number;
}

export function CustomerHistoryCard({ history }: { history: CustomerHistory }) {
  return (
    <Card className="border-0 shadow-sm bg-card  overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-10">
        <History className="h-24 w-24" />
      </div>
      <CardHeader>
        <CardTitle className="text-lg flex dark:text-white text-gray-700 items-center gap-2">
          <History className="h-5 w-5 text-emerald-400" />
          Customer Lifetime History
        </CardTitle>
        <CardDescription className="dark:text-slate-400 text-slate-600">
          Aggregate performance data for this customer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider font-semibold">
              Total Inquiries
            </p>
            <p className="text-2xl font-bold">{history.totalLeads}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              Trips Booked
            </p>
            <p className="text-2xl font-bold text-emerald-400">
              {history.wonTrips}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider font-semibold flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-400" />
              Cancelled (Loss)
            </p>
            <p className="text-2xl font-bold text-red-400">
              {history.lostTrips}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs dark:text-slate-400 text-slate-600 uppercase tracking-wider font-semibold flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              Total Profit
            </p>
            <div className="flex items-baseline gap-1">
              <IndianRupee className="h-4 w-4 text-emerald-400" />
              <p className="text-2xl font-bold text-emerald-400">
                {history.totalEarnings.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
