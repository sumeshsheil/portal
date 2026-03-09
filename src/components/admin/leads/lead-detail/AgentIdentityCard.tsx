"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    ExternalLink, FileText, ShieldCheck
} from "lucide-react";

interface AgentIdentityProps {
  agent: {
    name: string;
    aadhaarNumber?: string;
    panNumber?: string;
    documents?: {
      aadharCard?: string[];
      panCard?: string[];
      passport?: string[];
    };
    isVerified: boolean;
  };
}

export function AgentIdentityCard({ agent }: AgentIdentityProps) {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Agent Verification Info
          </CardTitle>
          {agent.isVerified && (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-[10px] h-5">
              Verified
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
            {agent.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{agent.name}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-tight">
              Assigned Agent
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase">
              Aadhaar Number
            </p>
            <p className="text-sm font-mono">{agent.aadhaarNumber || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-medium text-muted-foreground uppercase">
              PAN Number
            </p>
            <p className="text-sm font-mono">{agent.panNumber || "N/A"}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase">
            Identity Documents
          </p>

          <div className="grid grid-cols-1 gap-2">
            {/* Aadhaar Card Link */}
            {agent.documents?.aadharCard &&
              agent.documents.aadharCard.length > 0 && (
                <a
                  href={agent.documents.aadharCard[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    <span>Aadhaar Card</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}

            {/* PAN Card Link */}
            {agent.documents?.panCard && agent.documents.panCard.length > 0 && (
              <a
                href={agent.documents.panCard[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-orange-600" />
                  <span>PAN Card</span>
                </div>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            )}

            {/* Passport Link */}
            {agent.documents?.passport &&
              agent.documents.passport.length > 0 && (
                <a
                  href={agent.documents.passport[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-md bg-muted/50 hover:bg-muted text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Passport/ID</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              )}

            {!agent.documents?.aadharCard?.length &&
              !agent.documents?.panCard?.length &&
              !agent.documents?.passport?.length && (
                <p className="text-xs text-muted-foreground italic">
                  No documents uploaded
                </p>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
