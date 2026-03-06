"use server";

import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
import { verifySession } from "@/lib/auth-check";
import mongoose from "mongoose";
import { startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from "date-fns";

export interface FinanceStats {
  totalSales: number;        // Count of Won leads
  totalNet: number;          // netAmount of Won leads
  totalEarning: number;     // tripProfit of Won leads
  totalPaid: number;        // Sum of all verified payments
  monthlyGrowth?: number;    // Comparison with previous period
}

export interface FinanceFilters {
  tripType: "all" | "domestic" | "international";
  period: "current_month" | "last_month" | "last_3_months" | "year";
  agentId?: string;
}

export async function getFinanceStats(filters: FinanceFilters) {
  try {
    const session = await verifySession();
    await connectDB();

    const query: any = {};

    // 1. Role-based restrictions
    if (session.role === "agent") {
      query.agentId = new mongoose.Types.ObjectId(session.id);
      // Agents can only see last 3 months
      const threeMonthsAgo = subMonths(new Date(), 3);
      query.createdAt = { $gte: threeMonthsAgo };
    } else if (filters.agentId && filters.agentId !== "all") {
      query.agentId = new mongoose.Types.ObjectId(filters.agentId);
    }

    // 2. Trip Type filter
    if (filters.tripType !== "all") {
      query.tripType = filters.tripType;
    }

    // 3. Period filter (if not already restricted by agent check)
    if (session.role !== "agent") {
      const now = new Date();
      switch (filters.period) {
        case "current_month":
          query.createdAt = { ...query.createdAt, $gte: startOfMonth(now), $lte: endOfMonth(now) };
          break;
        case "last_month":
          const lastMonth = subMonths(now, 1);
          query.createdAt = { ...query.createdAt, $gte: startOfMonth(lastMonth), $lte: endOfMonth(lastMonth) };
          break;
        case "last_3_months":
          query.createdAt = { ...query.createdAt, $gte: subMonths(now, 3) };
          break;
        case "year":
          query.createdAt = { ...query.createdAt, $gte: new Date(now.getFullYear(), 0, 1) };
          break;
      }
    }

    // 4. Aggregation for Won Leads (Sales, Net, Profit)
    const wonLeads = await Lead.find({ ...query, stage: "won" })
      .select("tripCost netAmount tripProfit")
      .lean();

    const stats = wonLeads.reduce(
      (acc, lead: any) => {
        acc.totalSales += 1;
        acc.totalNet += lead.netAmount || 0;
        acc.totalEarning += lead.tripProfit || 0;
        return acc;
      },
      { totalSales: 0, totalNet: 0, totalEarning: 0 }
    );

    // 5. Aggregation for Payments (Total Paid)
    // For payments, we need to gather all verified payments from leads matching the filter (not just won leads)
    const leadsWithPayments = await Lead.find(query)
      .select("bookingPayments")
      .lean();

    let totalPaid = 0;
    leadsWithPayments.forEach((lead: any) => {
      if (lead.bookingPayments) {
        lead.bookingPayments.forEach((payment: any) => {
          if (payment.status === "verified") {
            totalPaid += payment.amount || 0;
          }
        });
      }
    });

    return {
      success: true,
      stats: {
        ...stats,
        totalPaid,
      },
    };
  } catch (error: any) {
    console.error("Finance Stats Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAgentsList() {
  try {
    const session = await verifySession();
    if (session.role !== "admin") return { success: false, error: "Unauthorized" };

    await connectDB();
    const agents = await User.find({ role: "agent", status: "active" })
      .select("name _id")
      .lean();

    return { 
      success: true, 
      agents: agents.map(a => ({ id: a._id.toString(), name: a.name })) 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
