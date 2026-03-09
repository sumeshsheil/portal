"use client";

import { getPayoutRequests } from "@/app/admin/(dashboard)/finance/payout-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import {
    Banknote, CheckCircle2, Clock, History, Loader2, Smartphone, XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

export function AgentPayoutList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingDetails, setViewingDetails] = useState<any>(null);

  async function fetchRequests() {
    setIsLoading(true);
    const result = await getPayoutRequests("agent");
    if (result.success) {
      setRequests(result.data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchRequests();

    const handleUpdate = () => {
      fetchRequests();
    };

    window.addEventListener("payout-updated", handleUpdate);
    return () => window.removeEventListener("payout-updated", handleUpdate);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 gap-1 px-2">
            <Clock className="h-3 w-3" />
            Processing
          </Badge>
        );
      case "Paid":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-1 px-2">
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </Badge>
        );
      case "decline":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 gap-1 px-2">
            <XCircle className="h-3 w-3" />
            Decline
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <>
    <Card className="border-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-6">
        <CardTitle className="text-xl font-black flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
            <History className="h-5 w-5 text-slate-400" />
          </div>
          Payout History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-5 pl-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Requested On</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient Info</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                <TableHead className="py-5 pr-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-slate-400 italic">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <History className="h-6 w-6 opacity-20" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-40">No records found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-slate-50 dark:border-slate-800">
                    <TableCell className="pl-8 py-4 uppercase text-[10px] font-bold text-slate-500">
                      {format(new Date(req.createdAt), "MMM d, yyyy")}
                      <div className="text-[9px] font-medium opacity-50">
                        {format(new Date(req.createdAt), "HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                        ₹{req.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div 
                        onClick={() => setViewingDetails(req)}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity active:scale-95"
                      >
                        {req.payoutMethod.type === "bank" ? (
                          <>
                            <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                              <Banknote className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{req.payoutMethod.details.bankName}</span>
                              <span className="text-[10px] font-mono text-slate-400">*{req.payoutMethod.details.accountNumber.slice(-4)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                              <Smartphone className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">UPI Transfer</span>
                              <span className="text-[10px] font-mono text-slate-400">{req.payoutMethod.details.upiId}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">{getStatusBadge(req.status)}</TableCell>
                    <TableCell className="pr-8 py-4 text-right">
                      {req.adminNote ? (
                         <div className="text-[10px] font-medium text-slate-500 italic max-w-[150px] ml-auto truncate bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded-lg">
                           "{req.adminNote}"
                         </div>
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {/* Viewing Details Modal */}
    <Dialog open={!!viewingDetails} onOpenChange={(open) => !open && setViewingDetails(null)}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className={`p-6 text-white ${viewingDetails?.payoutMethod.type === 'bank' ? 'bg-linear-to-br from-emerald-600 to-teal-700' : 'bg-linear-to-br from-blue-600 to-indigo-700'}`}>
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md">
              {viewingDetails?.payoutMethod.type === 'bank' ? 'Bank Details' : 'UPI Details'}
            </Badge>
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              {viewingDetails?.payoutMethod.type === 'bank' ? <Banknote className="h-6 w-6" /> : <Smartphone className="h-6 w-6" />}
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-white">
            Payout Destination
          </DialogTitle>
          <DialogDescription className="text-white/70 text-xs font-medium mt-1">
            These are the details you provided for this request.
          </DialogDescription>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 space-y-6">
          {viewingDetails?.payoutMethod.type === 'bank' ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Account Holder Name</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{viewingDetails.payoutMethod.details.accountHolderName || 'N/A'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Account Number</p>
                  <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{viewingDetails.payoutMethod.details.accountNumber}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">IFSC Code</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{viewingDetails.payoutMethod.details.ifscCode}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Bank Name</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{viewingDetails.payoutMethod.details.bankName}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Branch Name</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{viewingDetails.payoutMethod.details.branchName || 'N/A'}</p>
              </div>

              {/* Show UPI ID if available even in bank method (it might be sent from the backend) */}
              {viewingDetails.payoutMethod.details.upiId && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mt-2">
                  <p className="text-[10px] font-black uppercase text-blue-500 dark:text-blue-400 tracking-widest mb-1">UPI ID</p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{viewingDetails.payoutMethod.details.upiId}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-800 flex flex-col items-center justify-center text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600">
                <Smartphone className="h-8 w-8" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">UPI ID</p>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{viewingDetails?.payoutMethod.details.upiId}</p>
              </div>
            </div>
          )}

          <Button 
            className="w-full h-12 rounded-2xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
            onClick={() => setViewingDetails(null)}
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
