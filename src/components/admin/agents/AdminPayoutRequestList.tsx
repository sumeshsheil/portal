"use client";

import { getPayoutRequests, updatePayoutStatus } from "@/app/admin/(dashboard)/finance/payout-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
    Banknote, CheckCircle2, Clock, CreditCard, Loader2, MoreVertical, Smartphone, XCircle
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function AdminPayoutRequestList() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNote, setAdminNote] = useState("");
  const [actionType, setActionType] = useState<"decline" | "Paid" | "processing" | null>(null);
  const [viewingDetails, setViewingDetails] = useState<any>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    const result = await getPayoutRequests("admin");
    if (result.success) {
      setRequests(result.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedRequest || !actionType) return;

    startTransition(async () => {
      const result = await updatePayoutStatus(selectedRequest._id, actionType, adminNote);
      if (result.success) {
        toast.success(result.message);
        fetchRequests();
        setSelectedRequest(null);
        setAdminNote("");
        setActionType(null);
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

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
    <div className="rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
      <Table>
        <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
            <TableHead className="py-5 pl-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Agent Details</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Requested On</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Payout Amount</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Payout Destination</TableHead>
            <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
            <TableHead className="py-5 pr-8 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-slate-400 italic font-medium">
                No pending payout requests
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req._id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-slate-50 dark:border-slate-800">
                <TableCell className="pl-8 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-110">
                      <AvatarImage src={req.agentId?.image} alt={req.agentId?.name} className="object-cover" />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-black">
                        {req.agentId?.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">{req.agentId?.name}</span>
                      <span className="text-[10px] font-medium text-slate-500">{req.agentId?.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {format(new Date(req.createdAt), "MMM d, yyyy")}
                    <div className="text-[9px] font-medium opacity-50 lowercase tracking-normal">
                      at {format(new Date(req.createdAt), "HH:mm")}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    ₹{req.amount.toLocaleString()}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div 
                    onClick={() => setViewingDetails(req)}
                    className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 max-w-[220px] group-hover:bg-white dark:group-hover:bg-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/50 hover:shadow-emerald-500/10 transition-all active:scale-95"
                  >
                    {req.payoutMethod.type === "bank" ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                          <Banknote className="h-3 w-3" />
                          Bank Transfer
                        </div>
                        <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate">
                          {req.payoutMethod.details.bankName}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                            <span className="opacity-50">ACC:</span>
                            <span className="font-bold underline decoration-emerald-500/30 decoration-2">{req.payoutMethod.details.accountNumber}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                            <span className="opacity-50">IFSC:</span>
                            <span className="font-bold">{req.payoutMethod.details.ifscCode}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-600">
                          <Smartphone className="h-3 w-3" />
                          UPI Payment
                        </div>
                        <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 truncate">
                          {req.payoutMethod.details.upiId}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400">
                          Direct wallet transfer
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-4">{getStatusBadge(req.status)}</TableCell>
                <TableCell className="pr-8 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <MoreVertical className="h-5 w-5 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] rounded-2xl border-none shadow-2xl p-1.5">
                      {req.status !== "Paid" && (
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedRequest(req);
                            setActionType("Paid");
                          }}
                          className="text-emerald-600 font-bold focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/40 gap-2 p-3 rounded-xl cursor-pointer"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      {req.status === "processing" && (
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedRequest(req);
                            setActionType("decline");
                          }}
                          className="text-red-600 font-bold focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/40 gap-2 p-3 rounded-xl cursor-pointer"
                        >
                          <XCircle className="h-4 w-4" />
                          Decline Request
                        </DropdownMenuItem>
                      )}
                      {req.status === "decline" && (
                         <DropdownMenuItem 
                          onClick={() => {
                            setSelectedRequest(req);
                            setActionType("processing");
                          }}
                          className="text-amber-600 font-bold focus:text-amber-700 focus:bg-amber-50 dark:focus:bg-amber-950/40 gap-2 p-3 rounded-xl cursor-pointer"
                        >
                          <Clock className="h-4 w-4" />
                          Re-process
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
              Verify the details below before processing the payment.
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

      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === "Paid" ? <CreditCard className="text-emerald-500" /> : <XCircle className="text-red-500" />}
              {actionType === "Paid" ? "Confirm Payment" : "Decline Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "Paid" 
                ? `Are you sure you want to mark the request of ₹${selectedRequest?.amount?.toLocaleString()} by ${selectedRequest?.agentId?.name} as Paid?`
                : `Please provide a reason for declining the payout request of ₹${selectedRequest?.amount?.toLocaleString()} by ${selectedRequest?.agentId?.name}.`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Admin Note {actionType === "Paid" ? "(Optional)" : "(Required)"}
            </label>
            <Input 
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder={actionType === "Paid" ? "e.g. Paid via Bank Transfer" : "e.g. Incomplete details, reached monthly limit, etc."}
              className="h-12"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={isPending || (actionType === "decline" && !adminNote)}
              className={actionType === "Paid" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {actionType === "Paid" ? "Mark as Paid" : "Decline Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
