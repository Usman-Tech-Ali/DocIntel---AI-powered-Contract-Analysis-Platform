"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Summary {
  bulletPoints: string[];
  obligations: string[];
  rights: string[];
  paymentSummary: string;
  mainRisks: string[];
}

interface SummaryCardProps {
  summary: Summary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card className="border border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Contract Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Points */}
        {summary.bulletPoints?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3">KEY POINTS</p>
            <ul className="space-y-2">
              {summary.bulletPoints.map((point, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                  <span className="text-foreground leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Obligations */}
        {summary.obligations?.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-3">YOUR OBLIGATIONS</p>
            <ul className="space-y-2">
              {summary.obligations.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-muted-foreground shrink-0">→</span>
                  <span className="text-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rights */}
        {summary.rights?.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-3">YOUR RIGHTS</p>
            <ul className="space-y-2">
              {summary.rights.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-muted-foreground shrink-0">•</span>
                  <span className="text-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment */}
        {summary.paymentSummary && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">PAYMENT TERMS</p>
            <p className="text-sm leading-relaxed">{summary.paymentSummary}</p>
          </div>
        )}

        {/* Risks */}
        {summary.mainRisks?.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-3">IDENTIFIED RISKS</p>
            <ul className="space-y-2">
              {summary.mainRisks.map((risk, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-muted-foreground shrink-0">!</span>
                  <span className="text-foreground leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
