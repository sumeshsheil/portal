"use client";

import { useState } from "react";
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
      <Card className="border-emerald-100 bg-linear-to-r from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-950 dark:border-emerald-900/50 shadow-sm">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Current Plan</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white capitalize">
                    {currentPlan.name} Plan
                  </h2>
                  <Badge className="bg-emerald-500 text-white border-none capitalize">
                    {user.subscriptionStatus || "active"}
                  </Badge>
                </div>
                {userPlan === "free" && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    <Check className="h-3 w-3" />
                    Manage up to 30 Leads
                  </div>
                )}
              </div>
            </div>

            {user.subscriptionEndDate && (
              <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
                <Clock className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Valid Until</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {new Date(user.subscriptionEndDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {PLANS.filter(p => p.id !== "free").map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-2xl border-2 flex flex-col transition-all duration-300 group ${
                plan.highlight 
                  ? "border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-[1.02] z-10 bg-linear-to-b from-slate-900 to-slate-950 dark:from-slate-900 dark:to-slate-950" 
                  : plan.isCurrent(userPlan)
                  ? "border-emerald-500/50 shadow-lg bg-white dark:bg-slate-900"
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl bg-white dark:bg-slate-900"
              } ${(plan as any).fullWidth ? "md:col-span-2 lg:col-span-3" : ""}`}
            >
              {/* Badge */}
              {plan.badge ? (
                <div className="absolute top-3 right-3">
                  <div className="bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 fill-white" />
                    {plan.badge}
                  </div>
                </div>
              ) : plan.highlight ? (
                <div className="absolute top-3 right-3">
                  <div className="bg-linear-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1">
                    <Star className="h-2.5 w-2.5 fill-white" />
                    Recommended
                  </div>
                </div>
              ) : plan.isCurrent(userPlan) ? (
                <div className="absolute top-3 right-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">
                    Active Plan
                  </div>
                </div>
              ) : null}

              <div className={`flex-none p-6 pb-4 pt-8 ${plan.highlight ? "text-white" : ""}`}>
                {plan.payout && (
                  <Badge className={`mb-3 px-2 py-0 h-5 text-[10px] font-bold border-none uppercase tracking-tighter ${
                    plan.highlight 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  }`}>
                    {plan.payout}
                  </Badge>
                )}
                <h3 className={`text-2xl font-black tracking-tight ${plan.highlight ? "text-white" : "text-slate-900 dark:text-white"}`}>
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1 min-h-[44px]">
                  <span className={`text-4xl font-black drop-shadow-sm ${plan.highlight ? "text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-sm font-semibold ${plan.highlight ? "text-slate-400" : "text-slate-400"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`pt-2 h-10 text-sm font-medium ${plan.highlight ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {plan.description}
                </p>
              </div>

              {/* Divider */}
              <div className={`mx-6 h-px ${plan.highlight ? "bg-white/10" : "bg-slate-100 dark:bg-slate-800"}`} />

              {/* Features */}
              <div className="flex-1 p-6 pt-5">
                <ul className="space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.highlight 
                          ? "bg-emerald-500/20 border border-emerald-500/30" 
                          : "bg-emerald-100/80 dark:bg-emerald-900/50"
                      }`}>
                        <Check className={`h-3 w-3 ${plan.highlight ? "text-emerald-400" : "text-emerald-600 dark:text-emerald-400"}`} />
                      </div>
                      <span className={`font-medium leading-tight ${plan.highlight ? "text-slate-300" : "text-slate-700 dark:text-slate-300"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="flex-none p-6 pt-4 pb-6 mt-auto">
                {plan.isCurrent(userPlan) ? (
                  <Button 
                    className="w-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-bold h-12 rounded-xl border border-emerald-200 dark:border-emerald-800 cursor-default" 
                    disabled
                  >
                    <Check className="mr-2 h-4 w-4" /> Current Plan
                  </Button>
                ) : plan.id === "free" ? (
                  <Button 
                    className="w-full text-slate-500 cursor-default h-12 font-bold rounded-xl" 
                    disabled 
                    variant="outline"
                  >
                    Base Plan
                  </Button>
                ) : (
                  <Button 
                    className={`w-full h-12 rounded-xl font-bold transition-all shadow-lg cursor-pointer ${
                      plan.highlight 
                        ? "bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5" 
                        : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 hover:-translate-y-0.5 hover:shadow-lg"
                    }`}
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsPaymentModalOpen(true);
                    }}
                  >
                    {plan.buttonText}
                    {plan.highlight ? <Zap className="ml-2 h-4 w-4" /> : null}
                  </Button>
                )}
              </div>
            </div>
          ))}
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
