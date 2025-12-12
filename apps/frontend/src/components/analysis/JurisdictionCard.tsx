"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, AlertTriangle, Check, MapPin } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-500" />
          Jurisdiction & Governing Law
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Governing Law</span>
            </div>
            <p className="font-medium">{governingLaw || "Not specified"}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Jurisdiction</span>
            </div>
            <p className="font-medium">{jurisdiction || "Not specified"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          {isValid ? (
            <Badge variant="success" className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              Valid
            </Badge>
          ) : (
            <Badge variant="warning" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Review Needed
            </Badge>
          )}
        </div>

        {warnings && warnings.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Warnings
            </p>
            <ul className="space-y-1">
              {warnings.map((warning, i) => (
                <li key={i} className="text-sm text-yellow-700 dark:text-yellow-300">
                  • {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Recommendations
            </p>
            <ul className="space-y-1">
              {recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-blue-700 dark:text-blue-300">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
