"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import {
  Banknote,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { verifyPayment, rejectPayment } from "@/app/admin/(dashboard)/leads/[id]/payment-actions";
import { toast } from "sonner";

interface Payment {
  _id: string;
  amount: number;
  type: "booking" | "trip_cost";
  transactionId: string;
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: any;
}

interface PaymentManagerProps {
  leadId: string;
  payments: Payment[];
  tripCost?: number;
  paymentStatus?: string;
  customerEmail?: string;
  isAdmin?: boolean;
}

export function PaymentManager({
  leadId,
  payments = [],
  tripCost = 0,
  paymentStatus,
  customerEmail,
  isAdmin = false,
}: PaymentManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [expanded, setExpanded] = useState(true);

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const verifiedAmount = payments
    .filter((p) => p.status === "verified")
    .reduce((sum, p) => sum + p.amount, 0);

  const handleVerify = (paymentId: string) => {
    startTransition(async () => {
      const result = await verifyPayment(leadId, paymentId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    if (!rejectId) return;

    startTransition(async () => {
      const result = await rejectPayment(leadId, rejectId, rejectionReason);
      if (result.success) {
        toast.success(result.message);
        setRejectId(null);
        setRejectionReason("");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader 
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="space-y-1">
          <CardTitle className="text-lg flex items-center gap-2">
            <Banknote className="h-5 w-5 text-emerald-600" />
            Payment Management
          </CardTitle>
          <CardDescription>
            {pendingPayments.length > 0 
              ? `${pendingPayments.length} pending verification` 
              : isAdmin 
                ? "Verify and track manual payments"
                : "Track manual payment status"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {pendingPayments.length > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              Pending
            </Badge>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-6">
          {!isAdmin && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-red-800 dark:text-red-300">
                <p className="font-bold mb-1 uppercase tracking-tight">
                  ⚠️ Agent Warning ⚠️
                </p>
                <p className="font-medium">
                  Agents are strictly prohibited from collecting payments directly from customers. All payments must be processed through the Budget Travel Packages website. Any violation may result in account suspension, termination and legal action.
                </p>
              </div>
            </div>
          )}

          {/* Summary Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Verified Amount
              </p>
              <p className="text-xl font-bold text-emerald-600">
                ₹{verifiedAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Total Trip Cost
              </p>
              <p className="text-xl font-bold text-blue-600">
                ₹{tripCost.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Payment List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Payment History
            </h3>
            
            {payments.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
              </div>
            ) : (
              <div className="divide-y border rounded-lg overflow-hidden bg-background">
                {[...payments].reverse().map((payment) => (
                  <div key={payment._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">
                            {payment.type === "booking" ? "Booking Amount" : "Remaining Cost"}
                          </p>
                          <Badge 
                            variant={
                              payment.status === "verified" ? "default" : 
                              payment.status === "pending" ? "outline" : "destructive"
                            }
                            className={cn(
                              "text-[10px] h-5",
                              payment.status === "verified" && "bg-emerald-500 hover:bg-emerald-600 text-black",
                              payment.status === "pending" && "text-amber-600 border-amber-200"
                            )}
                          >
                            {payment.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.submittedAt || Date.now()), "MMM d, yyyy • HH:mm")}
                        </p>
                      </div>
                      <p className="text-lg font-bold">
                        ₹{payment.amount.toLocaleString("en-IN")}
                      </p>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center justify-between text-xs bg-muted/30 p-2 rounded border border-dashed">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-muted-foreground font-medium shrink-0">TXID:</span>
                          <code className="text-blue-600 font-mono truncate max-w-[150px]">
                            {payment.transactionId}
                          </code>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-[10px]"
                          onClick={() => {
                            navigator.clipboard.writeText(payment.transactionId);
                            toast.success("TXID Copied");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    )}

                    {isAdmin && payment.status === "pending" && (
                      <div className="flex items-center gap-2 pt-2">
                        <Button 
                          className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 font-bold text-black"
                          disabled={isPending}
                          onClick={() => handleVerify(payment._id)}
                        >
                          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                          Verify
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1 h-9 font-bold"
                          disabled={isPending}
                          onClick={() => setRejectId(payment._id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {payment.status === "rejected" && payment.rejectionReason && (
                      <div className="p-2.5 bg-red-50 dark:bg-red-950/20 rounded border border-red-100 dark:border-red-900/50">
                        <p className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase mb-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Rejection Reason
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-300 italic">
                          &quot;{payment.rejectionReason}&quot;
                        </p>
                      </div>
                    )}

                    {payment.status === "verified" && payment.verifiedAt && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified on {(() => {
                          try {
                            return format(new Date(payment.verifiedAt), "MMM d");
                          } catch (e) {
                            return "Unknown Date";
                          }
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}

      {/* Reject Dialog */}
      <Dialog open={!!rejectId} onOpenChange={(open) => !open && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Please provide a reason why this payment cannot be verified. This will be sent to the customer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Rejection</Label>
              <Textarea
                id="reason"
                placeholder="e.g. Transaction ID not found, Amount mismatch, etc."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectSubmit}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
