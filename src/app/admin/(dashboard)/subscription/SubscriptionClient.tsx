"use client";

import { useState } from "react";
import { motion } from "motion/react";
import UpcomingPaymentsIcon from "@/components/ui/icons/upcoming-payments-icon";
import { 
  Check, 
  Download, 
  Copy, 
  CreditCard, 
  Zap, 
  Clock, 
  AlertCircle,
  ShieldCheck,
  Phone,
  Star,
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 as LoaderIcon } from "lucide-react";
import { submitSubscriptionRequest } from "./actions";

interface SubscriptionClientProps {
  user: any;
}

const PLANS = [
  {
    name: "Free",
    id: "free",
    price: "₹0",
    description: "Default plan for new agents",
    features: [
      "Manage up to 30 Leads",
      "No Inquiry access",
    ],
    buttonText: "Current Plan",
    isCurrent: (plan: string) => plan === "free",
    highlight: false,
    icon: null,
    accentColor: "slate",
    payout: null,
  },
  {
    name: "Basic",
    id: "basic",
    price: "₹50,000",
    period: "/year",
    description: "For growing agents",
    features: [
      "100 Leads (Contacts)",
      "10 Packages",
      "5 Hot Enquiries Daily",
    ],
    buttonText: "Upgrade to Basic",
    isCurrent: (plan: string) => plan === "basic",
    highlight: false,
    icon: null,
    accentColor: "blue",
    payout: "2% Payout Fee",
  },
  {
    name: "Pro",
    id: "pro",
    price: "₹75,000",
    period: "/year",
    description: "Most popular choice",
    features: [
      "Unlimited Leads",
      "30 Packages",
      "10 Hot Enquiries Daily",
    ],
    buttonText: "Upgrade to Pro",
    isCurrent: (plan: string) => plan === "pro",
    highlight: true,
    icon: <Star className="h-4 w-4" />,
    accentColor: "emerald",
    payout: "2% Payout Fee",
  },
  {
    name: "Premium",
    id: "premium",
    price: "₹99,999",
    period: "/year",
    description: "For established agencies",
    features: [
      "Unlimited Leads",
      "Unlimited Packages",
      "15 Hot Enquiries Daily",
    ],
    buttonText: "Upgrade to Premium",
    isCurrent: (plan: string) => plan === "premium",
    highlight: false,
    icon: null,
    accentColor: "violet",
    payout: "2% Payout Fee",
  },
  {
    name: "Enterprise",
    id: "enterprise",
    price: "₹1,49,000",
    period: "/year",
    description: "All access with live support",
    features: [
      "Unlimited Leads & Packages",
      "15 Hot Enquiries Daily",
      "Live Calls & Chats"
    ],
    buttonText: "Upgrade to Enterprise",
    isCurrent: (plan: string) => plan === "enterprise",
    highlight: false,
    icon: null,
    accentColor: "amber",
    payout: "0% Payout Fee",
    fullWidth: true,
    badge: "VIP Exclusive",
    isEnterprise: true,
  }
];

export default function SubscriptionClient({ user }: SubscriptionClientProps) {
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const router = useRouter();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = "/images/payments/qr-code.jpeg";
    link.download = "BudgetTravel_PaymentQR.jpeg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitRequest = async () => {
    if (!selectedPlan) return;
    setIsSubmitting(true);
    try {
      const result = await submitSubscriptionRequest(
        selectedPlan.id,
        "yearly",
        transactionId
      );

      if (result.success) {
        toast.success("Request submitted! We will verify your payment soon.");
        setIsPaymentModalOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to submit request.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userPlan = user.plan || "free";
  const currentPlan = PLANS.find(p => p.isCurrent(userPlan)) || PLANS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Current Subscription Status */}
      <Card className="border-emerald-100 bg-linear-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-950 dark:border-emerald-900/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
        <CardContent className="py-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shadow-inner">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-600/60 dark:text-emerald-400/60 uppercase tracking-[0.2em]">Current Subscription</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize tracking-tight">
                    {currentPlan.name} <span className="text-slate-400 font-light">Partner</span>
                  </h2>
                  <Badge className="bg-emerald-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white border-none">
                    {user.subscriptionStatus || "active"}
                  </Badge>
                </div>
                {userPlan === "free" && (
                  <div className="flex items-center gap-1.5 mt-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                    <div className="h-1 w-1 rounded-full bg-emerald-500" />
                    Manage up to 30 Leads
                  </div>
                )}
              </div>
            </div>

            {user.subscriptionEndDate && (
              <div className="flex items-center gap-4 px-5 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-emerald-100/50 dark:border-emerald-800/50 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Renews On</p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                    {new Date(user.subscriptionEndDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {/* Plan Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr mt-12">
          {PLANS.filter(p => p.id !== "free").map((plan) => {
            const isEnterprise = (plan as any).isEnterprise;
            return (
              <motion.div
                key={plan.name}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative overflow-hidden rounded-[2.5rem] border-2 flex flex-col transition-all duration-500 group ${
                  isEnterprise
                    ? "border-slate-800 dark:border-slate-800 bg-slate-950 shadow-2xl shadow-emerald-500/10"
                    : plan.highlight 
                    ? "border-emerald-500 shadow-2xl shadow-emerald-500/20 z-10 bg-linear-to-b from-slate-900 to-slate-950" 
                    : plan.isCurrent(userPlan)
                    ? "border-emerald-500/50 shadow-lg bg-white dark:bg-slate-900"
                    : "border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 bg-white dark:bg-slate-900"
                } ${(plan as any).fullWidth ? "md:col-span-2 lg:col-span-3" : ""}`}
              >
                {/* Enterprise Shimmer Border Effect */}
                {isEnterprise && (
                  <div className="absolute inset-0 pointer-events-none rounded-[2.5rem] p-[1.5px] overflow-hidden">
                    <div className="absolute inset-[-50%] bg-linear-to-r from-transparent via-emerald-500/40 to-transparent animate-[spin_4s_linear_infinite]" />
                    <div className="absolute inset-[1.5px] bg-slate-950 rounded-[2.4rem]" />
                  </div>
                )}

                {/* Mesh/Radial glow for enterprise */}
                {isEnterprise && (
                  <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full" />
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-6 right-6 z-20">
                  {plan.badge ? (
                    <div className="relative group/badge">
                      <div className="absolute inset-0 bg-linear-to-r from-amber-400/50 to-orange-500/50 blur-md opacity-50 group-hover/badge:opacity-100 transition-opacity" />
                      <div className="relative bg-linear-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5 border border-white/20">
                        <Star className="h-3 w-3 fill-slate-950" />
                        {plan.badge}
                      </div>
                    </div>
                  ) : plan.highlight ? (
                    <div className="bg-linear-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-lg flex items-center gap-1.5">
                      <Zap className="h-3 w-3 fill-white" />
                      Most Popular
                    </div>
                  ) : plan.isCurrent(userPlan) ? (
                    <div className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.15em] border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm">
                      Active Plan
                    </div>
                  ) : null}
                </div>

                <div className={`relative z-10 flex-none p-8 pb-4 pt-10 ${plan.highlight || isEnterprise ? "text-white" : ""}`}>
                  {plan.payout && (
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-lg mb-4 text-[10px] font-black uppercase tracking-widest ${
                      isEnterprise
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : plan.highlight 
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" 
                        : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50"
                    }`}>
                      {plan.payout}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <h3 className={`text-3xl font-black tracking-tight ${plan.highlight || isEnterprise ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm font-medium ${isEnterprise ? "text-slate-400/80" : plan.highlight ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-baseline gap-1.5">
                    <span className={`text-5xl font-black tracking-tighter ${isEnterprise ? "text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.3)]" : plan.highlight ? "text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm font-bold opacity-60 ${plan.highlight || isEnterprise ? "text-slate-400" : "text-slate-400"}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Glassy Divider */}
                <div className={`mx-8 h-px shrink-0 ${plan.highlight || isEnterprise ? "bg-white/5" : "bg-slate-100 dark:bg-slate-800"}`} />

                {/* Features */}
                <div className="relative z-10 flex-1 p-8 pt-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-4 group/item">
                        <div className={`h-6 w-6 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 ${
                          isEnterprise
                            ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                            : plan.highlight 
                            ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" 
                            : "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                        }`}>
                          <Check className="h-3.5 w-3.5 stroke-[4px]" />
                        </div>
                        <span className={`text-sm font-semibold tracking-wide ${isEnterprise ? "text-slate-300" : plan.highlight ? "text-slate-300" : "text-slate-700 dark:text-slate-300"}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Button Section */}
                <div className="relative z-10 flex-none p-8 pt-4 pb-8 mt-auto">
                  {plan.isCurrent(userPlan) ? (
                    <div className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 bg-emerald-500/5 text-emerald-500 border border-emerald-500/20 font-black uppercase tracking-[0.2em] text-[11px]">
                      <ShieldCheck className="h-4 w-4" /> Current Active Plan
                    </div>
                  ) : (
                    <Button 
                      className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] transition-all cursor-pointer shadow-xl ${
                        isEnterprise
                          ? "bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-500 text-slate-950 hover:scale-[1.02] hover:shadow-emerald-500/40"
                          : plan.highlight 
                          ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:scale-[1.02] hover:shadow-emerald-500/30" 
                          : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 hover:scale-[1.02] hover:shadow-slate-500/20"
                      }`}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setIsPaymentModalOpen(true);
                      }}
                    >
                      {plan.buttonText}
                      {isEnterprise || plan.highlight ? <Zap className="ml-2 h-4 w-4 fill-current" /> : null}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800/50 flex flex-col md:flex-row items-center gap-6">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Scale Your Travel Agency</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Upgrading your plan unlocks incredible features like more custom packages, access to High-Value Lead assignment logic from the admin, and reduced withdrawal fees on total margins!
            </p>
          </div>
        </div>
      </div>

      {/* Manual Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[700px] space-y-0 gap-0 p-0 overflow-hidden rounded-3xl border-none">
          {selectedPlan && (  
            <>
            {/* Header */}
            <div className="bg-linear-to-br from-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px"}} />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white mb-2 h-5">Manual Payment</Badge>
                  <DialogTitle className="text-2xl font-black">Complete Upgrade</DialogTitle>
                  <DialogDescription className="text-emerald-100 text-xs font-medium mt-1">
                    Pay {selectedPlan.price} {selectedPlan.period} for <span className="font-bold text-white">{selectedPlan.name}</span> plan manually.
                  </DialogDescription>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-widest">Amount</p>
                  <p className="text-3xl font-black">{selectedPlan.price}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Column: QR and Details */}
                <div className="space-y-5">
                  <div className="relative group mx-auto w-fit bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg">
                    <div className="h-[180px] w-[180px] relative rounded-xl overflow-hidden">
                      <Image 
                        src="/images/payments/qr-code.jpeg" 
                        alt="Payment QR Code" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md rounded-full text-[9px] h-6 font-black uppercase tracking-wider px-3 flex items-center gap-1 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={handleDownloadQR}
                    >
                      <Download className="h-2.5 w-2.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center text-violet-600">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">UPI ID</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white">sumesh.shil@ibl</p>
                        </div>
                      </div>
                      <button 
                        className="h-7 w-7 opacity-40 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer" 
                        onClick={() => copyToClipboard("sumesh.shil@ibl", "UPI ID")}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white">+91 9242868839</p>
                        </div>
                      </div>
                      <button 
                        className="h-7 w-7 opacity-40 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer" 
                        onClick={() => copyToClipboard("+91 9242868839", "Phone number")}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Confirmation Form */}
                <div className="flex flex-col h-full justify-between pt-2">
                  <div className="space-y-5">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                      <Label htmlFor="transactionId" className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 block">
                        Transaction ID / Ref Number
                      </Label>
                      <Input 
                        id="transactionId"
                        placeholder="Enter transaction ID"
                        className="bg-white dark:bg-slate-900 h-11 rounded-xl dark:border-slate-700 border-slate-200 focus:border-emerald-500 font-medium"
                        value={transactionId}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransactionId(e.target.value)}
                      />
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        Enter the ID from your UPI app after payment is completed.
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-black text-center text-slate-500 dark:text-slate-400 uppercase tracking-widest">Accepted Payment Methods</p>
                      <div className="flex items-center justify-center gap-4">
                        {["Paytm", "gpay", "phonepe", "upi"].map((brand) => (
                          <div key={brand} className="relative h-10 w-16 opacity-70">
                            <Image src={`/images/payments/${brand}.webp`} alt={brand} fill className="object-contain" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      className={`w-full h-12 rounded-2xl font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isSubmitting || !transactionId 
                          ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none" 
                          : "bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:-translate-y-0.5 hover:shadow-emerald-500/40"
                      }`}
                      onClick={handleSubmitRequest}
                      disabled={isSubmitting || !transactionId}
                    >
                      {isSubmitting ? (
                        <><LoaderIcon className="h-4 w-4 animate-spin" />Submitting...</>
                      ) : (
                        <><ShieldCheck className="h-5 w-5" />Complete Request</>
                      )}
                    </button>
                    <p className="text-[9px] text-center text-slate-400 mt-3 uppercase tracking-widest font-bold">
                      Activation in 2-4 business hours.
                    </p>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <UpcomingPaymentsIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
