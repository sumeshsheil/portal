"use client";

import React from "react";
import { format } from "date-fns";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  FileText,
  MapPin,
  ExternalLink,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";

import { DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Agent {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string;
  altPhone?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: number;
  address?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  documents?: {
    aadharCard?: string[];
    panCard?: string[];
    passport?: string[];
  };
  verificationStatus: string;
  isVerified: boolean;
  image?: string;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    branchName?: string;
  };
  upiId?: string;
  createdAt: string | Date;
}

interface AgentDetailDialogProps {
  agent: Agent;
}

export function AgentDetailDialog({ agent }: AgentDetailDialogProps) {
  return (
    <DialogContent data-lenis-prevent className="sm:max-w-4xl max-w-4xl w-[90%] max-h-[92vh] overflow-y-scroll overflow-x-hidden p-0 border-none bg-white dark:bg-slate-950 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 ">
      {/* Dynamic Header Section */}
      <div className="relative">
        <div className="h-32 bg-linear-to-br from-emerald-500 via-teal-600 to-cyan-700 dark:from-emerald-600 dark:via-teal-700 dark:to-cyan-800 opacity-90" />
        <div className="absolute top-4 right-4 z-10">
          <Badge
            className={cn(
              "px-3 py-1 text-[10px] font-bold tracking-widest uppercase border shadow-lg backdrop-blur-md",
              agent.status === "active"
                ? "bg-emerald-500 text-white border-emerald-400"
                : "bg-slate-500 text-white border-slate-400",
            )}
          >
            {agent.status}
          </Badge>
        </div>

        <div className="absolute -bottom-14 left-6 md:left-10 flex items-end gap-6 w-full">
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/30 transition-all rounded-full" />
            <div className="relative h-28 w-28 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center border-[6px] border-white dark:border-slate-950 shadow-2xl transform transition-transform hover:scale-105 overflow-hidden">
              <div className="h-full w-full rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                {agent.image ? (
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="h-full w-full object-cover rounded-xl"
                  />
                ) : (
                  <User className="h-14 w-14 text-slate-300 dark:text-slate-600" />
                )}
              </div>
            </div>
          </div>
          <div className="pb-4 hidden md:block flex-1 min-w-0 pr-10">
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md flex items-center gap-3 truncate">
              {agent.name}
              {agent.isVerified && (
                <div className="shrink-0 p-1 bg-white rounded-full shadow-lg">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                </div>
              )}
            </h2>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-10 px-6 md:px-10 space-y-10">
        {/* Name and Basic Metadata for Mobile */}
        <div className="md:hidden space-y-3">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
            {agent.name}
            {agent.isVerified && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                <ShieldCheck className="h-3 w-3 mr-1" /> Verified
              </Badge>
            )}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-[10px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 font-medium tracking-tight"
            >
              <Mail className="h-3 w-3 mr-1.5" /> {agent.email}
            </Badge>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            {/* Quick Stats / Summary Row */}
            <div className="flex gap-4">
              <div className="flex-1 bg-emerald-50/50 dark:bg-emerald-500/5 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10">
                <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-1">
                  Role
                </p>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 capitalize">
                  {agent.role}
                </p>
              </div>
              <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-500/70 dark:text-slate-400/70 uppercase tracking-widest mb-1">
                  Joined
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {format(new Date(agent.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            {/* Detailed Categories */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 flex items-center gap-2 px-1">
                  <div className="w-6 h-[1.5px] bg-emerald-500/30" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4 bg-slate-50/30 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100/80 dark:border-slate-800/80">
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      First Name
                    </span>
                    <span className="text-right md:text-left font-bold text-slate-900 dark:text-slate-200">
                      {agent.firstName || "—"}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">
                      Last Name
                    </span>
                    <span className="text-right md:text-left font-bold text-slate-900 dark:text-slate-200">
                      {agent.lastName || "—"}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">
                      Gender
                    </span>
                    <span className="text-right md:text-left font-bold text-slate-900 dark:text-slate-200 capitalize">
                      {agent.gender || "—"}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">
                      Age
                    </span>
                    <span className="text-right md:text-left font-bold text-slate-900 dark:text-slate-200">
                      {agent.age || "—"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 flex items-center gap-2 px-1">
                  <div className="w-6 h-[1.5px] bg-emerald-500/30" />
                  Identification Keys
                </h3>
                <div className="grid grid-cols-1 gap-4 bg-slate-50/30 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100/80 dark:border-slate-800/80">
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Aadhaar No.
                    </span>
                    <span className="text-right md:text-left font-mono font-bold tracking-wider text-slate-900 dark:text-slate-200">
                      {agent.aadhaarNumber || "—"}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">
                      PAN No.
                    </span>
                    <span className="text-right md:text-left font-mono font-bold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
                      {agent.panNumber || "—"}
                    </span>

                    <span className="text-slate-500 dark:text-slate-400">
                      Verification
                    </span>
                    <div className="text-right md:text-left">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-black h-5"
                      >
                        {(
                          agent.verificationStatus || "unverified"
                        ).toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 flex items-center gap-2">
                    <div className="w-6 h-[1.5px] bg-amber-500/30" />
                    Payout & Bank Details
                  </h3>
                  <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 animate-pulse">
                    Coming Soon: More Methods
                  </Badge>
                </div>
                
                <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                  {/* UPI Identification */}
                  <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 shrink-0 bg-amber-100 dark:bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-200 dark:border-amber-500/20 shadow-sm">
                        <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">UPI ID</span>
                        <span className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">{agent.upiId || "Not Provided"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Grid */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-linear-to-b from-transparent to-slate-50/30 dark:to-slate-900/10">
                    <div className="flex gap-4">
                      <div className="h-9 w-9 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs">
                        <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Holder Name</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{agent.bankDetails?.accountHolderName || "—"}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="h-9 w-9 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs">
                        <CreditCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Account Number</span>
                        <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{agent.bankDetails?.accountNumber || "—"}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="h-9 w-9 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs">
                        <Banknote className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Bank Name</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{agent.bankDetails?.bankName || "—"}</span>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="h-9 w-9 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xs">
                        <ShieldCheck className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">IFSC Code</span>
                        <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">{agent.bankDetails?.ifscCode || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 flex items-center gap-2 px-1">
                <div className="w-6 h-[1.5px] bg-cyan-500/30" />
                Contact Channels
              </h3>
              <div className="bg-slate-50/30 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100/80 dark:border-slate-800/80 flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                    <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Phone Numbers
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                      {agent.phone || "—"}
                    </span>
                    {agent.altPhone && (
                      <span className="text-xs text-slate-500 font-medium">
                        Alt: {agent.altPhone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 bg-cyan-100 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20 shadow-sm">
                    <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Verified Email
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                      {agent.email}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-300 dark:border-slate-700 shadow-sm">
                    <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Official Address
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic pr-2">
                      {agent.address ||
                        "No official address provided on profile."}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 flex items-center gap-2 px-1">
                <div className="w-6 h-[1.5px] bg-emerald-500/30" />
                Document Repository
              </h3>
              <div className="bg-slate-50/30 dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-100/80 dark:border-slate-800/80 shadow-inner">
                {agent.documents &&
                (agent.documents.aadharCard?.length ||
                  agent.documents.panCard?.length ||
                  agent.documents.passport?.length) ? (
                  <div className="grid grid-cols-1 gap-3">
                    {agent.documents.aadharCard?.map((doc, idx) => (
                      <DocumentLink
                        key={`aadhar-${idx}`}
                        label="Aadhaar Document"
                        url={doc}
                      />
                    ))}
                    {agent.documents.panCard?.map((doc, idx) => (
                      <DocumentLink
                        key={`pan-${idx}`}
                        label="PAN Card Extract"
                        url={doc}
                      />
                    ))}
                    {agent.documents.passport?.map((doc, idx) => (
                      <DocumentLink
                        key={`passport-${idx}`}
                        label="Passport Copy"
                        url={doc}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-600 animate-pulse">
                    <FileText className="h-10 w-10 mb-2 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Empty Repository
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function DocumentLink({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600">
          <FileText className="h-4 w-4" />
        </div>
        <span className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-tight">
          {label}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="h-8 rounded-xl px-3 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-600 hover:text-emerald-600"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </Button>
    </div>
  );
}
