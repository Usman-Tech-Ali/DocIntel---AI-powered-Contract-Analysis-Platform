"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface MissingClause {
  clauseName: string;
  importance: "critical" | "important" | "recommended";
  description: string;
  suggestedText: string;
}

interface MissingClausesCardProps {
  missingClauses: MissingClause[];
}

export function MissingClausesCard({ missingClauses }: MissingClausesCardProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case "critical":
        return "Critical";
      case "important":
        return "Important";
      default:
        return "Recommended";
    }
  };

  if (!missingClauses || missingClauses.length === 0) {
    return (
      <Card className="border border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Missing Clauses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">All essential clauses present</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Missing Clauses</CardTitle>
          <span className="text-xs text-muted-foreground">{missingClauses.length} missing</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {missingClauses.map((clause, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === clause.clauseName ? null : clause.clauseName)}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary">
                  {getImportanceLabel(clause.importance)}
                </span>
                <span className="text-sm font-medium">
                  {clause.clauseName.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
              {expanded === clause.clauseName ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {expanded === clause.clauseName && (
              <div className="px-4 pb-4 space-y-4 border-t bg-secondary/30">
                <div className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">DESCRIPTION</p>
                  <p className="text-sm text-muted-foreground">{clause.description}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-muted-foreground">SUGGESTED TEXT</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2"
                      onClick={() => copyToClipboard(clause.suggestedText, clause.clauseName)}
                    >
                      {copied === clause.clauseName ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm">{clause.suggestedText}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
