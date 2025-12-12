"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RedFlag {
  id: string;
  clauseText: string;
  issue: string;
  severity: "green" | "yellow" | "red";
  explanation: string;
  location?: string;
}

interface ClauseFix {
  original_clause: string;
  fixed_clause: string;
  explanation: string;
  negotiation_wording: string;
}

interface RedFlagsCardProps {
  redFlags: RedFlag[];
  onFixClause: (clauseText: string, issue: string) => Promise<ClauseFix>;
  isFixing: boolean;
}

export function RedFlagsCard({ redFlags, onFixClause, isFixing }: RedFlagsCardProps) {
  const [expandedFlag, setExpandedFlag] = useState<string | null>(null);
  const [fixes, setFixes] = useState<Record<string, ClauseFix>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const handleFix = async (flag: RedFlag) => {
    if (fixes[flag.id]) {
      setExpandedFlag(expandedFlag === flag.id ? null : flag.id);
      return;
    }
    try {
      const fix = await onFixClause(flag.clauseText, flag.issue);
      setFixes((prev) => ({ ...prev, [flag.id]: fix }));
      setExpandedFlag(flag.id);
    } catch (error) {
      console.error("Failed to fix clause:", error);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "red":
        return "High";
      case "yellow":
        return "Medium";
      default:
        return "Low";
    }
  };

  if (!redFlags || redFlags.length === 0) {
    return (
      <Card className="border border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Red Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No issues detected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Red Flags</CardTitle>
          <span className="text-xs text-muted-foreground">{redFlags.length} issues</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {redFlags.map((flag) => (
          <div key={flag.id} className="border rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary">
                      {getSeverityLabel(flag.severity)}
                    </span>
                    {flag.location && (
                      <span className="text-xs text-muted-foreground">{flag.location}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium mb-1">{flag.issue}</p>
                  <p className="text-sm text-muted-foreground">{flag.explanation}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleFix(flag)}
                  disabled={isFixing}
                  className="shrink-0"
                >
                  {fixes[flag.id] ? "View Fix" : "Get Fix"}
                </Button>
              </div>

              <button
                onClick={() => setExpandedFlag(expandedFlag === flag.id ? null : flag.id)}
                className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {expandedFlag === flag.id ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                {expandedFlag === flag.id ? "Hide details" : "Show clause"}
              </button>
            </div>

            {expandedFlag === flag.id && (
              <div className="px-4 pb-4 space-y-4 border-t bg-secondary/30">
                <div className="pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">ORIGINAL CLAUSE</p>
                  <p className="text-sm text-muted-foreground italic">
                    "{flag.clauseText.slice(0, 300)}
                    {flag.clauseText.length > 300 ? "..." : ""}"
                  </p>
                </div>

                {fixes[flag.id] && (
                  <>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground">SUGGESTED FIX</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={() => copyToClipboard(fixes[flag.id].fixed_clause, `fix-${flag.id}`)}
                        >
                          {copied === `fix-${flag.id}` ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm">{fixes[flag.id].fixed_clause}</p>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-2">WHY THIS IS BETTER</p>
                      <p className="text-sm text-muted-foreground">{fixes[flag.id].explanation}</p>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-muted-foreground">NEGOTIATION EMAIL</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={() =>
                            copyToClipboard(fixes[flag.id].negotiation_wording, `neg-${flag.id}`)
                          }
                        >
                          {copied === `neg-${flag.id}` ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm italic text-muted-foreground">
                        {fixes[flag.id].negotiation_wording}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
