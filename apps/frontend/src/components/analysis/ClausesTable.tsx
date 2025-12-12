"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Check, Minus } from "lucide-react";

interface ClausesTableProps {
  clauses: Record<string, any>;
}

const CLAUSE_LABELS: Record<string, string> = {
  paymentTerms: "Payment Terms",
  paymentAmount: "Payment Amount",
  paymentSchedule: "Payment Schedule",
  milestones: "Milestones",
  dueDates: "Due Dates",
  terminationNoticePeriod: "Termination Notice",
  terminationConditions: "Termination Conditions",
  liabilityLimitations: "Liability Limitations",
  liabilityCap: "Liability Cap",
  ipOwnership: "IP Ownership",
  workOwnership: "Work Ownership",
  confidentialityRequirements: "Confidentiality",
  confidentialityDuration: "Confidentiality Duration",
  revisionCount: "Revision Count",
  revisionTerms: "Revision Terms",
  governingLaw: "Governing Law",
  jurisdiction: "Jurisdiction",
  nonCompete: "Non-Compete",
  nonCompeteDuration: "Non-Compete Duration",
  nonSolicit: "Non-Solicitation",
  disputeResolution: "Dispute Resolution",
  arbitrationClause: "Arbitration",
  deliverables: "Deliverables",
  scopeOfWork: "Scope of Work",
  refundRules: "Refund Rules",
  deadlines: "Deadlines",
  renewalTerms: "Renewal Terms",
  autoRenewal: "Auto-Renewal",
  contractDuration: "Contract Duration",
  startDate: "Start Date",
  endDate: "End Date",
  killFee: "Kill Fee",
  latePaymentPenalty: "Late Payment Penalty",
  indemnification: "Indemnification",
  forceMajeure: "Force Majeure",
  assignmentRights: "Assignment Rights",
  amendmentProcess: "Amendment Process",
  noticeRequirements: "Notice Requirements",
  warrantyTerms: "Warranty Terms",
  insuranceRequirements: "Insurance Requirements",
};

export function ClausesTable({ clauses }: ClausesTableProps) {
  const [search, setSearch] = useState("");

  const filteredClauses = Object.entries(clauses).filter(([key, value]) => {
    if (!value || value === "null" || value === null) return false;
    const label = CLAUSE_LABELS[key] || key;
    return (
      label.toLowerCase().includes(search.toLowerCase()) ||
      String(value).toLowerCase().includes(search.toLowerCase())
    );
  });

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value);
  };

  const foundCount = filteredClauses.length;
  const totalPossible = Object.keys(CLAUSE_LABELS).length;

  return (
    <Card className="border border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Extracted Clauses</CardTitle>
          <span className="text-xs text-muted-foreground">
            {foundCount} of {totalPossible} found
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clauses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                  CLAUSE
                </th>
                <th className="text-left p-3 text-xs font-medium text-muted-foreground">
                  VALUE
                </th>
                <th className="text-center p-3 text-xs font-medium text-muted-foreground w-16">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredClauses.map(([key, value]) => (
                <tr key={key} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-3">
                    <span className="text-sm font-medium">{CLAUSE_LABELS[key] || key}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {formatValue(value)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Check className="w-4 h-4 text-foreground mx-auto" />
                  </td>
                </tr>
              ))}
              {filteredClauses.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    <Minus className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No clauses found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
