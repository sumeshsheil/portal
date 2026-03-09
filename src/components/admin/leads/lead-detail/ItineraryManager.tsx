"use client";

import { updateLeadItineraryPdf } from "@/app/admin/(dashboard)/leads/[id]/itinerary-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ui/image-upload";
import { ExternalLink, FileText } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export function ItineraryManager({
  leadId,
  itineraryPdfUrl,
  isWon,
}: {
  leadId: string;
  itineraryPdfUrl?: string;
  isWon?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handlePdfUpload = (urls: string[]) => {
    if (urls.length === 0) return;

    startTransition(async () => {
      const result = await updateLeadItineraryPdf(leadId, urls[0]);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Itinerary PDF updated successfully");
      }
    });
  };

  const handlePdfRemove = () => {
    startTransition(async () => {
      const result = await updateLeadItineraryPdf(leadId, "");
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Itinerary PDF removed");
      }
    });
  };

  return (
    <Card className="border-0 shadow-sm border-emerald-100 bg-emerald-50/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          Trip Itinerary (PDF)
        </CardTitle>
        {itineraryPdfUrl && (
          <Button size="sm" variant="outline" asChild className="h-8">
            <a
              href={itineraryPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Current PDF
            </a>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Official PDF itinerary that will be visible to the customer on their
            dashboard.
          </p>
          <ImageUpload
            value={itineraryPdfUrl ? [itineraryPdfUrl] : []}
            onChange={handlePdfUpload}
            onRemove={handlePdfRemove}
            accept="application/pdf"
            maxFiles={1}
            folder="/lead-itineraries"
            disabled={isPending || isWon}
          />
        </div>
      </CardContent>
    </Card>
  );
}
