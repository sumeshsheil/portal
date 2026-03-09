"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, IndianRupee, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { requestPayout } from "@/app/admin/(dashboard)/finance/payout-actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const payoutSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  agentNote: z.string().optional(),
});

type PayoutFormValues = z.infer<typeof payoutSchema>;

interface RequestPayoutDialogProps {
  availableBalance: number;
}

export function RequestPayoutDialog({ availableBalance }: RequestPayoutDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutSchema) as any,
    defaultValues: {
      amount: 0,
      agentNote: "",
    },
  });

  async function onSubmit(values: PayoutFormValues) {
    if (values.amount > availableBalance) {
      toast.error(`You cannot request more than your available balance (₹${availableBalance.toLocaleString()})`);
      return;
    }

    setIsPending(true);
    try {
      const result = await requestPayout(values.amount, values.agentNote);

      if (result.success) {
        toast.success(result.message);
        window.dispatchEvent(new CustomEvent("payout-updated"));
        router.refresh();
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to submit request");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold gap-2 shadow-xl transition-all duration-300 active:scale-[0.98] py-7 text-lg group">
          <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          Request Payout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white dark:bg-slate-900">
        <div className="bg-linear-to-br from-emerald-500 via-emerald-600 to-emerald-800 p-8 text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
            <IndianRupee className="h-28 w-28 -mr-6 -mt-6 rotate-12" />
          </div>
          <DialogHeader className="text-left relative z-10">
            <DialogTitle className="text-3xl font-black tracking-tight mb-2 drop-shadow-md">
              Request Payout
            </DialogTitle>
            <DialogDescription className="text-emerald-50/80 text-sm font-medium leading-relaxed max-w-[280px]">
              Securely withdraw your earnings to your verified payout method.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-inner">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200/60 mb-1">Available to Withdraw</p>
            <div className="text-4xl font-black tracking-tighter drop-shadow-sm">
              ₹{availableBalance.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Amount to Withdraw (₹)</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-600 dark:text-emerald-500 font-black text-xl flex items-center justify-center">₹</div>
                        <Input 
                          placeholder="0" 
                          type="number" 
                          className="pl-10 h-14 text-xl font-bold bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500/20 dark:focus:border-emerald-500/30 rounded-2xl focus-visible:ring-0 transition-all text-slate-900 dark:text-white"
                          {...field} 
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agentNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Note (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add any details for the admin..." 
                        className="resize-none min-h-[100px] bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-emerald-500/20 dark:focus:border-emerald-500/30 rounded-2xl focus-visible:ring-0 transition-all p-4 text-sm text-slate-900 dark:text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500" />
                  </FormItem>
                )}
              />

              {availableBalance <= 0 && (
                <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-amber-800 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Insufficient balance for payout
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isPending || availableBalance <= 0}
                className="w-full h-15 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-600/20 dark:shadow-none transition-all active:scale-[0.98] group"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                {isPending ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
