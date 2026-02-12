"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JurisdictionInfo {
  governingLaw: string;
  jurisdiction: string;
  isValid: boolean;
  warnings: string[];
  recommendations?: string[];
}

interface JurisdictionCardProps {
  jurisdictionInfo: JurisdictionInfo;
}

export function JurisdictionCard({ jurisdictionInfo }: JurisdictionCardProps) {
  const { governingLaw, jurisdiction, isValid, warnings, recommendations } = jurisdictionInfo;

  return (
    <Card className="border border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Jurisdiction & Law</CardTitle>
          <span className="text-xs px-2 py-0.5 rounded bg-secondary">
            {isValid ? "Valid" : "Review Needed"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">GOVERNING LAW</p>
            <p className="text-sm font-medium">{governingLaw || "Not specified"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">JURISDICTION</p>
            <p className="text-sm font-medium">{jurisdiction || "Not specified"}</p>
          </div>
        </div>

        {warnings && warnings.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">WARNINGS</p>
            <ul className="space-y-1">
              {warnings.map((warning, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span>•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">RECOMMENDATIONS</p>
            <ul className="space-y-1">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                  <span>→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
