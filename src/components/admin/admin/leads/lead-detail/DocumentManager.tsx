"use client";

import {
    addDocument,
    removeDocument
} from "@/app/admin/(dashboard)/leads/[id]/document-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    ExternalLink, File, FileCheck, FileText, Hotel, Loader2, Plane, Plus, Receipt, Trash2
} from "lucide-react";
import { useState, useTransition } from "react";

interface Document {
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

const TYPE_OPTIONS = [
  { value: "ticket", label: "Ticket", icon: Plane },
  { value: "voucher", label: "Voucher", icon: Hotel },
  { value: "visa", label: "Visa", icon: FileCheck },
  { value: "itinerary_pdf", label: "Itinerary PDF", icon: FileText },
  { value: "invoice", label: "Invoice", icon: Receipt },
  { value: "other", label: "Other", icon: File },
];

function getDocIcon(type: string) {
  const found = TYPE_OPTIONS.find((t) => t.value === type);
  return found ? found.icon : File;
}

export function DocumentManager({
  leadId,
  documents,
}: {
  leadId: string;
  documents: Document[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleAdd = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      const result = await addDocument(leadId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setShowForm(false);
      }
    });
  };

  const handleRemove = (index: number) => {
    startTransition(async () => {
      await removeDocument(leadId, index);
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          Documents
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Document
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <form
            action={handleAdd}
            className="space-y-3 p-4 border rounded-lg bg-muted/30"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input name="name" placeholder="Document name" required />
              <select
                name="type"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                defaultValue="other"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <Input name="url" placeholder="https://..." type="url" required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No documents uploaded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc, index) => {
              const Icon = getDocIcon(doc.type);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <Badge variant="outline" className="text-xs mt-0.5">
                        {doc.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="sm" variant="ghost" asChild>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemove(index)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
