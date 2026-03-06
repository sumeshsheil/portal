"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Check,
  X,
  Eye,
  Loader2,
  FileText,
  Smartphone,
  User,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateAgentVerificationStatus } from "@/app/admin/(dashboard)/agents/actions";

interface VerificationRequest {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  documents?: {
    aadharCard: string[];
    panCard: string[];
  };
  verificationStatus: string;
  createdAt: string;
}

interface VerificationRequestListProps {
  requests: VerificationRequest[];
}

export function VerificationRequestList({
  requests,
}: VerificationRequestListProps) {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] =
    useState<VerificationRequest | null>(null);
  const [note, setNote] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleStatusUpdate(status: "approved" | "rejected") {
    if (!selectedAgent) return;

    setIsPending(true);
    try {
      const result = await updateAgentVerificationStatus(
        selectedAgent._id,
        status,
        note,
      );
      if (result.success) {
        toast.success(`Agent ${status} successfully`);
        setSelectedAgent(null);
        setNote("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Travel Partner</TableHead>
              <TableHead>Aadhaar / PAN</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No pending verification requests.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={request.image} alt={request.name} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {request.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{request.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {request.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <p>
                        <span className="text-muted-foreground">UIDAI:</span>{" "}
                        {request.aadhaarNumber || "N/A"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">PAN:</span>{" "}
                        {request.panNumber || "N/A"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(request.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="capitalize bg-amber-50 text-amber-700 border-amber-200"
                    >
                      {request.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={selectedAgent?._id === request._id}
                      onOpenChange={(open) => !open && setSelectedAgent(null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAgent(request)}
                        >
                          <Eye className="h-4 w-4 mr-2" /> Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="lg:max-w-4xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Review Travel Partner Verification</DialogTitle>
                          <DialogDescription>
                            Review the identity documents provided by{" "}
                            {request.name}.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 px-2">
                          <div className="space-y-8">
                            <div>
                              <h4 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900">
                                <User className="h-5 w-5" /> Travel Partner Details
                              </h4>
                              <div className="flex items-center gap-4 mb-4">
                                <Avatar className="h-14 w-14 lg:w-26 lg:h-26">
                                  <AvatarImage
                                    src={request.image}
                                    alt={request.name}
                                  />
                                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                                    {request.name
                                      ?.substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-slate-900">
                                    {request.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {request.email}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-3 text-[15px] text-slate-800">
                                <p>
                                  <span className="text-muted-foreground w-16 inline-block">
                                    Phone:
                                  </span>{" "}
                                  {request.phone || "N/A"}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900">
                                <ShieldAlert className="h-5 w-5" />{" "}
                                Identification
                              </h4>
                              <div className="space-y-3 text-[15px] text-slate-800">
                                <p>
                                  <span className="text-muted-foreground w-20 inline-block">
                                    Aadhaar:
                                  </span>{" "}
                                  {request.aadhaarNumber || "N/A"}
                                </p>
                                <p>
                                  <span className="text-muted-foreground w-20 inline-block">
                                    PAN:
                                  </span>{" "}
                                  {request.panNumber || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900">
                              <FileText className="h-5 w-5" /> Documents
                            </h4>
                            <div className="space-y-4">
                              <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-[15px] font-bold mb-3 text-slate-900">
                                  Aadhaar Card
                                </p>
                                {request.documents?.aadharCard?.[0] ? (
                                  <Button
                                    variant="link"
                                    asChild
                                    className="p-0 h-auto text-[#00E676] hover:text-[#00C853] font-semibold text-base"
                                  >
                                    <a
                                      href={request.documents.aadharCard[0]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View Document
                                    </a>
                                  </Button>
                                ) : (
                                  <span className="text-[15px] text-red-500">
                                    Not uploaded
                                  </span>
                                )}
                              </div>
                              <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                <p className="text-[15px] font-bold mb-3 text-slate-900">
                                  PAN Card
                                </p>
                                {request.documents?.panCard?.[0] ? (
                                  <Button
                                    variant="link"
                                    asChild
                                    className="p-0 h-auto text-[#00E676] hover:text-[#00C853] font-semibold text-base"
                                  >
                                    <a
                                      href={request.documents.panCard[0]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View Document
                                    </a>
                                  </Button>
                                ) : (
                                  <span className="text-[15px] text-red-500">
                                    Not uploaded
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 pb-4">
                          <Label className="text-base font-semibold text-slate-900">
                            Admin Notes / Feedback (Optional)
                          </Label>
                          <Textarea
                            placeholder="Reason for rejection or internal notes..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="resize-none h-24 text-[15px] rounded-xl"
                          />
                        </div>

                        <DialogFooter className="gap-2 lg:gap-6">
                          <Button
                            variant="destructive"
                            onClick={() => handleStatusUpdate("rejected")}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <X className="h-4 w-4 mr-2" />
                            )}
                            Reject Request
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleStatusUpdate("approved")}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Check className="h-4 w-4 mr-2" />
                            )}
                            Approve Partner
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
