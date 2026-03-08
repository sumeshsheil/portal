"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, ExternalLink } from "lucide-react";
import { updateLeadTravelDocumentsPdf } from "@/app/admin/(dashboard)/leads/[id]/document-actions";
import ImageUpload from "@/components/ui/image-upload";
import { toast } from "sonner";

export function DocumentManager({
  leadId,
  travelDocumentsPdfUrl,
  isWon,
}: {
  leadId: string;
  travelDocumentsPdfUrl?: string;
  isWon?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handlePdfUpload = (urls: string[]) => {
    if (urls.length === 0) return;

    startTransition(async () => {
      const result = await updateLeadTravelDocumentsPdf(leadId, urls[0]);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Travel documents PDF updated successfully");
      }
    });
  };

  const handlePdfRemove = () => {
    startTransition(async () => {
      const result = await updateLeadTravelDocumentsPdf(leadId, "");
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Travel documents PDF removed");
      }
    });
  };

  return (
    <Card className="border-0 shadow-sm border-emerald-100 bg-emerald-50/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          Travel Documents & Tickets (PDF)
        </CardTitle>
        {travelDocumentsPdfUrl && (
          <Button size="sm" variant="outline" asChild className="h-8">
            <a
              href={travelDocumentsPdfUrl}
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
            Official travel documents and tickets PDF that will be visible to
            the customer on their dashboard.
          </p>
          <ImageUpload
            value={travelDocumentsPdfUrl ? [travelDocumentsPdfUrl] : []}
            onChange={handlePdfUpload}
            onRemove={handlePdfRemove}
            accept="application/pdf"
            maxFiles={1}
            folder="/lead-documents"
            disabled={isPending || isWon}
          />
        </div>
      </CardContent>
    </Card>
  );
}
