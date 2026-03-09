"use server";

import { verifySession } from "@/lib/auth-check";
import Lead from "@/lib/db/models/Lead";
import PayoutRequest from "@/lib/db/models/PayoutRequest";
import User from "@/lib/db/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { endOfDay, endOfMonth, startOfDay, startOfMonth, subMonths } from "date-fns";
import mongoose from "mongoose";

export interface FinanceStats {
  wonCount: number;         // Count of Won leads
  totalNet: number;          // Realized cost based on verified payments
  totalEarning: number;     // Realized profit based on verified payments
  totalRevenue: number;     // Sum of all verified payments
  monthlyGrowth?: number;    // Comparison with previous period
}

export interface PayoutBalance {
  totalEarnings: number;     // All-time earnings from Won/Dropped leads
  pendingPayouts: number;    // Total of "processing" requests
  paidAmount: number;        // Total of "Paid" requests
  availableToPayout: number; // totalEarnings - pendingPayouts - paidAmount
}

export interface FinanceFilters {
  tripType: "all" | "domestic" | "international";
  period: "current_month" | "last_month" | "last_3_months" | "last_6_months" | "year" | "last_year" | "all_time" | "custom";
  agentId?: string;
  dateFrom?: string; 
  dateTo?: string;   
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
        case "last_6_months":
          query.createdAt = { ...query.createdAt, $gte: subMonths(now, 6) };
          break;
        case "year":
          query.createdAt = { ...query.createdAt, $gte: new Date(now.getFullYear(), 0, 1) };
          break;
        case "last_year":
          query.createdAt = { 
            ...query.createdAt, 
            $gte: new Date(now.getFullYear() - 1, 0, 1), 
            $lte: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59) 
          };
          break;
        case "custom":
          if (filters.dateFrom) {
            query.createdAt = { ...query.createdAt, $gte: startOfDay(new Date(filters.dateFrom)) };
          }
          if (filters.dateTo) {
            query.createdAt = { ...query.createdAt, $lte: endOfDay(new Date(filters.dateTo)) };
          }
          break;
        case "all_time":
          // No date filter
          break;
      }
    }

    // 4. Aggregation for metrics
    // We need all leads matching the query to calculate realized numbers from payments
    const targetLeads = await Lead.find(query)
      .select("stage tripCost netAmount tripProfit bookingPayments")
      .lean();
    
    let wonCount = 0;
    let totalNet = 0;
    let totalEarning = 0;
    let totalRevenue = 0;

    targetLeads.forEach((lead: any) => {
      if (lead.stage === "won") wonCount++;

      // Calculate verified payments for this lead
      const verifiedSum = (lead.bookingPayments || [])
        .filter((p: any) => p.status === "verified")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      if (verifiedSum > 0) {
        totalRevenue += verifiedSum;
        
        const tripCost = lead.tripCost || 0;
        const netAmount = lead.netAmount || 0;
        const tripProfit = lead.tripProfit || 0;

        // Proportionally distribute verified payments between cost and profit
        // This ensures: Actual Cost + Total Profit = Total Revenue (Verified Payments)
        if (tripCost > 0) {
          const ratio = verifiedSum / tripCost;
          totalNet += netAmount * ratio;
          totalEarning += tripProfit * ratio;
        }
      }
    });

    return {
      success: true,
      stats: {
        wonCount,
        totalNet: Math.round(totalNet),
        totalEarning: Math.round(totalEarning),
        totalRevenue: Math.round(totalRevenue),
      },
    };
  } catch (error: any) {
    console.error("Finance Stats Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAgentPayoutBalance(agentId?: string) {
  try {
    const session = await verifySession();
    await connectDB();

    const targetAgentId = session.role === "admin" && agentId 
      ? agentId 
      : session.id;

    if (!targetAgentId) return { success: false, error: "Agent ID required" };

    // 1. Calculate Total Earnings from all Won/Dropped leads (All Time)
    const leads = await Lead.find({
      agentId: new mongoose.Types.ObjectId(targetAgentId),
      stage: { $in: ["won", "dropped"] }
    }).select("tripProfit tripCost netAmount bookingPayments").lean();

    let totalEarnings = 0;
    leads.forEach((lead: any) => {
      const verifiedSum = (lead.bookingPayments || [])
        .filter((p: any) => p.status === "verified")
        .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

      if (verifiedSum > 0) {
        const tripCost = lead.tripCost || 0;
        const tripProfit = lead.tripProfit || 0;
        const netAmount = lead.netAmount || 0;
        if (tripCost > 0) {
          const ratio = verifiedSum / tripCost;
          // Payout is calculated on both Net (Actual Cost) + Profit
          totalEarnings += (netAmount + tripProfit) * ratio;
        }
      }
    });


    // 2. Fetch all Payout Requests
    const payoutRequests = await PayoutRequest.find({
      agentId: new mongoose.Types.ObjectId(targetAgentId)
    }).lean();

    let pendingPayouts = 0;
    let paidAmount = 0;

    payoutRequests.forEach((req: any) => {
      if (req.status === "processing") {
        pendingPayouts += req.amount;
      } else if (req.status === "Paid") {
        paidAmount += req.amount;
      }
    });

    const balance: PayoutBalance = {
      totalEarnings: Math.round(totalEarnings),
      pendingPayouts: Math.round(pendingPayouts),
      paidAmount: Math.round(paidAmount),
      availableToPayout: Math.round(totalEarnings - pendingPayouts - paidAmount),
    };

    return { success: true, balance };
  } catch (error: any) {
    console.error("Payout Balance Error:", error);
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
