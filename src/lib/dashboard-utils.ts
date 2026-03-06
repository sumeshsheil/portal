// User-friendly stage labels for the customer dashboard
// These replace the internal CRM terminology with customer-facing language.

export const STAGE_LABELS: Record<string, string> = {
  new: "Inquiry Received",
  contacted: "Under Review",
  booked: "Booked",
  proposal_sent: "Proposal Ready",
  negotiation: "Finalizing",
  won: "Trip Confirmed ✈️",
  dropped: "Cancelled/Dropped",
  abandoned: "Expired/Abandoned",
};

export const STAGE_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  booked: "bg-emerald-100 text-emerald-700 border-emerald-200",
  proposal_sent: "bg-purple-100 text-purple-700 border-purple-200",
  negotiation: "bg-orange-100 text-orange-700 border-orange-200",
  won: "bg-emerald-100 text-emerald-700 border-emerald-200",
  dropped: "bg-red-100 text-red-700 border-red-200",
  abandoned: "bg-gray-100 text-gray-700 border-gray-200",
};

export const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  partial: "bg-blue-100 text-blue-700 border-blue-200",
  paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export function getStageLabel(stage: string): string {
  return STAGE_LABELS[stage] || stage;
}

export function getStageColor(stage: string): string {
  return STAGE_COLORS[stage] || "bg-slate-100 text-slate-700 border-slate-200";
}

export function getPaymentColor(status: string): string {
  return PAYMENT_COLORS[status] || "bg-gray-100 text-gray-700 border-gray-200";
}

// Progress stepper stages for user dashboard (user-friendly labels)
export const USER_PROGRESS_STAGES = [
  { key: "new", label: "Inquiry Received" },
  { key: "contacted", label: "Under Review" },
  { key: "booked", label: "Booked" },
  { key: "proposal_sent", label: "Proposal Ready" },
  { key: "negotiation", label: "Finalizing" },
  { key: "won", label: "Trip Confirmed" },
];
