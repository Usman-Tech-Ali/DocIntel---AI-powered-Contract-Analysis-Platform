"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RiskScore {
  score: number;
  level: "green" | "yellow" | "red";
  summary: string;
  factors?: Array<{ factor: string; impact: number }>;
}

interface RiskScoreCardProps {
  riskScore: RiskScore;
}

export function RiskScoreCard({ riskScore }: RiskScoreCardProps) {
  const { score, level, summary, factors } = riskScore;

  const getLevelLabel = () => {
    switch (level) {
      case "green":
        return "Low";
      case "yellow":
        return "Medium";
      case "red":
        return "High";
    }
  };

  return (
    <Card className="border border-border/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-5xl font-semibold">{score}</span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
          <div className="mt-3">
            <Progress value={score} className="h-2" />
          </div>
          <p className="mt-2 text-sm">
            <span className="font-medium">{getLevelLabel()} Risk</span>
            <span className="text-muted-foreground"> Contract</span>
          </p>
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          {summary}
        </p>

        {/* Risk Factors */}
        {factors && factors.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              CONTRIBUTING FACTORS
            </p>
            <div className="space-y-3">
              {factors.slice(0, 4).map((factor, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground truncate flex-1 pr-4">
                    {factor.factor}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium tabular-nums",
                      factor.impact > 0 ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {factor.impact > 0 ? "+" : ""}
                    {factor.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
