"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Download, Loader2, FileText, AlertTriangle, Shield,
  CheckCircle, MessageSquare, Clock, ArrowUpRight, Search, Check,
  Minus, AlertCircle, XCircle, Copy, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAnalysis } from "@/hooks/useAnalysis";
import { ChatPanel, UploadZone } from "@/components/analysis";
import { cn } from "@/lib/utils";
import { getDocumentContent } from "@/lib/api";
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip,
} from "recharts";

// Severity badge component
const SeverityBadge = ({ severity }: { severity: string }) => {
  const styles = {
    red: "bg-red-100 text-red-700 border-red-200",
    yellow: "bg-amber-100 text-amber-700 border-amber-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    critical: "bg-red-100 text-red-700 border-red-200",
    important: "bg-amber-100 text-amber-700 border-amber-200",
    recommended: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium capitalize", styles[severity as keyof typeof styles] || "bg-secondary")}>
      {severity}
    </span>
  );
};

// Risk score indicator
const RiskIndicator = ({ score, level }: { score: number; level: string }) => {
  const colors = { red: "text-red-500", yellow: "text-amber-500", green: "text-emerald-500" };
  const bgColors = { red: "bg-red-500", yellow: "bg-amber-500", green: "bg-emerald-500" };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={cn("text-4xl font-bold", colors[level as keyof typeof colors])}>{score}</span>
        <span className="text-sm text-muted-foreground">/100</span>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-xs text-muted-foreground capitalize">{level} Risk Level</p>
    </div>
  );
};

export default function DocumentAnalysisPage() {
  const params = useParams();
  const documentId = params.id as string;
  const [activeView, setActiveView] = useState<"overview" | "document" | "clauses" | "issues" | "chat">("overview");
  const [isNewUpload, setIsNewUpload] = useState(documentId === "new");
  const [clauseSearch, setClauseSearch] = useState("");
  const [fixResult, setFixResult] = useState<{ issue: string; fixed: string; explanation: string; negotiation?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const {
    isUploading, isAnalyzing, isChatting, isFixing, error, analysis,
    chatHistory, upload, analyze, fetchAnalysis, chat, fix, downloadPdf, downloadCorrected, clearChat,
  } = useAnalysis();
  const [isDownloadingCorrected, setIsDownloadingCorrected] = useState(false);

  useEffect(() => {
    if (documentId && documentId !== "new") {
      fetchAnalysis(documentId).catch(() => setIsNewUpload(true));
    }
  }, [documentId, fetchAnalysis]);

  // Load document content when switching to document view
  useEffect(() => {
    if (activeView === "document" && !documentContent && !isLoadingContent && documentId !== "new") {
      setIsLoadingContent(true);
      getDocumentContent(documentId)
        .then(data => setDocumentContent(data.content))
        .catch(() => setDocumentContent(null))
        .finally(() => setIsLoadingContent(false));
    }
  }, [activeView, documentId, documentContent, isLoadingContent]);

  const handleUpload = async (file: File) => {
    const result = await upload(file);
    await analyze(result.id);
    setIsNewUpload(false);
    window.history.replaceState({}, "", `/documents/${result.id}`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading states
  if (isNewUpload && !analysis) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="fixed left-0 top-0 h-screen z-50"><Sidebar /></div>
        <div className="flex-1 ml-56 flex items-center justify-center">
          <UploadZone onUpload={handleUpload} isUploading={isUploading} isAnalyzing={isAnalyzing} />
        </div>
      </div>
    );
  }

  if (isAnalyzing || !analysis) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="fixed left-0 top-0 h-screen z-50"><Sidebar /></div>
        <div className="flex-1 ml-56 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-amber-500 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{isAnalyzing ? "Analyzing your contract..." : "Loading..."}</p>
            <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  // Data
  const clauseCount = Object.keys(analysis.extractedClauses || {}).filter(k => analysis.extractedClauses[k]).length;
  const redFlagCount = analysis.redFlags?.length || 0;
  const missingCount = analysis.missingClauses?.length || 0;
  const riskScore = analysis.riskScore?.score || 0;
  const riskLevel = analysis.riskScore?.level || "green";

  const issueDistribution = [
    { name: "Red Flags", value: redFlagCount || 1, color: "#ef4444" },
    { name: "Missing", value: missingCount || 1, color: "#f59e0b" },
    { name: "OK", value: Math.max(clauseCount - redFlagCount, 1), color: "#22c55e" },
  ];

  const clauseAreaData = [
    { name: "Payment", value: analysis.extractedClauses?.paymentTerms ? 8 : 2 },
    { name: "Terms", value: analysis.extractedClauses?.terminationConditions ? 7 : 1 },
    { name: "Liability", value: analysis.extractedClauses?.liabilityLimitations ? 9 : 3 },
    { name: "IP", value: analysis.extractedClauses?.ipOwnership ? 6 : 2 },
    { name: "Confid.", value: analysis.extractedClauses?.confidentialityRequirements ? 8 : 1 },
    { name: "Disputes", value: analysis.extractedClauses?.disputeResolution ? 7 : 2 },
  ];

  const CLAUSE_LABELS: Record<string, string> = {
    paymentTerms: "Payment Terms", paymentAmount: "Payment Amount", paymentSchedule: "Payment Schedule",
    terminationNoticePeriod: "Termination Notice", terminationConditions: "Termination Conditions",
    liabilityLimitations: "Liability Limitations", liabilityCap: "Liability Cap",
    ipOwnership: "IP Ownership", workOwnership: "Work Ownership",
    confidentialityRequirements: "Confidentiality", confidentialityDuration: "Confidentiality Duration",
    governingLaw: "Governing Law", jurisdiction: "Jurisdiction",
    nonCompete: "Non-Compete", nonCompeteDuration: "Non-Compete Duration",
    disputeResolution: "Dispute Resolution", arbitrationClause: "Arbitration",
    deliverables: "Deliverables", scopeOfWork: "Scope of Work",
    contractDuration: "Contract Duration", startDate: "Start Date", endDate: "End Date",
    renewalTerms: "Renewal Terms", autoRenewal: "Auto-Renewal",
    indemnification: "Indemnification", forceMajeure: "Force Majeure",
    milestones: "Milestones", dueDates: "Due Dates", deadlines: "Deadlines",
    revisionCount: "Revision Count", revisionTerms: "Revision Terms",
    latePaymentPenalty: "Late Payment Penalty", killFee: "Kill Fee",
  };

  const filteredClauses = Object.entries(analysis.extractedClauses || {})
    .filter(([key, value]) => {
      if (!value || value === "null" || (Array.isArray(value) && value.length === 0)) return false;
      const label = CLAUSE_LABELS[key] || key;
      return label.toLowerCase().includes(clauseSearch.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-background flex">
      <div className="fixed left-0 top-0 h-screen z-50"><Sidebar /></div>
      
      <div className="flex-1 flex flex-col ml-56">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Header title="Contract Analysis" />
        </div>

        <main className="flex-1 p-6 overflow-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/documents">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold capitalize">{analysis.documentType?.replace(/_/g, " ") || "Contract"}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(analysis.analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  {analysis.detectedLanguage?.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(["overview", "document", "clauses", "issues", "chat"] as const).map((v) => (
                <Button
                  key={v}
                  variant={activeView === v ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView(v)}
                  className="capitalize"
                >
                  {v}
                </Button>
              ))}
              <div className="w-px h-6 bg-border mx-1" />
              <Button onClick={downloadPdf} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" /> Analysis Report
              </Button>
              <Button 
                onClick={async () => {
                  setIsDownloadingCorrected(true);
                  try {
                    await downloadCorrected();
                  } finally {
                    setIsDownloadingCorrected(false);
                  }
                }} 
                size="sm" 
                variant="default"
                disabled={isDownloadingCorrected}
              >
                {isDownloadingCorrected ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                {isDownloadingCorrected ? "Generating..." : "Corrected Contract"}
              </Button>
            </div>
          </div>

          {/* OVERVIEW */}
          {activeView === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-slate-50 to-white">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn("p-2 rounded-lg", riskLevel === "red" ? "bg-red-100" : riskLevel === "yellow" ? "bg-amber-100" : "bg-emerald-100")}>
                        <Shield className={cn("h-5 w-5", riskLevel === "red" ? "text-red-600" : riskLevel === "yellow" ? "text-amber-600" : "text-emerald-600")} />
                      </div>
                      <Badge variant="outline" className="text-xs">{riskLevel}</Badge>
                    </div>
                    <RiskIndicator score={riskScore} level={riskLevel} />
                  </CardContent>
                </Card>

                {[
                  { label: "Clauses Found", value: clauseCount, total: 38, icon: FileText, color: "blue" },
                  { label: "Red Flags", value: redFlagCount, icon: AlertTriangle, color: "red" },
                  { label: "Missing Clauses", value: missingCount, icon: Minus, color: "amber" },
                ].map((stat, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className={cn("p-2 rounded-lg", `bg-${stat.color}-100`)}>
                          <stat.icon className={cn("h-5 w-5", `text-${stat.color}-600`)} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stat.label}
                        {stat.total && <span className="text-xs"> / {stat.total}</span>}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="col-span-2 border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Clause Coverage</CardTitle>
                    <CardDescription>Key contract areas analyzed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={clauseAreaData}>
                          <defs>
                            <linearGradient id="colorClause" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 10]} />
                          <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#colorClause)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Issue Distribution</CardTitle>
                    <CardDescription>Contract health overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[160px] w-full">
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={issueDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                            {issueDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                      {issueDistribution.map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-muted-foreground">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-white/20">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Ask AI About Contract</h3>
                        <p className="text-sm opacity-80 mt-1">Get instant answers about clauses, risks, and obligations.</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" className="w-full" onClick={() => setActiveView("chat")}>
                      <Sparkles className="h-4 w-4 mr-2" /> Start Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="col-span-2 border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Key Findings</CardTitle>
                        <CardDescription>Top issues requiring attention</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1" onClick={() => setActiveView("issues")}>
                        View All <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {analysis.redFlags?.length ? (
                      <div className="space-y-2">
                        {analysis.redFlags.slice(0, 3).map((flag, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer" onClick={() => setActiveView("issues")}>
                            <div className={cn("p-2 rounded-lg", flag.severity === "red" ? "bg-red-100" : "bg-amber-100")}>
                              <AlertTriangle className={cn("h-4 w-4", flag.severity === "red" ? "text-red-600" : "text-amber-600")} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{flag.issue}</p>
                              <p className="text-xs text-muted-foreground">{flag.location || "Contract clause"}</p>
                            </div>
                            <SeverityBadge severity={flag.severity} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-10 w-10 mx-auto text-emerald-500/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No red flags detected</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* DOCUMENT VIEW */}
          {activeView === "document" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Original Document</CardTitle>
                    <CardDescription>View the original contract</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {documentContent && (
                      <Button variant="outline" size="sm" onClick={() => handleCopy(documentContent)}>
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? "Copied!" : "Copy Text"}
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/documents/${documentId}/file`} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Original
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingContent ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : documentContent ? (
                  <div className="bg-secondary/30 rounded-lg p-6 max-h-[600px] overflow-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">{documentContent}</pre>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Click below to load the document text or download the original file</p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" size="sm" onClick={async () => {
                        setIsLoadingContent(true);
                        try {
                          const data = await getDocumentContent(documentId);
                          setDocumentContent(data.content);
                        } catch {
                          setDocumentContent(null);
                        } finally {
                          setIsLoadingContent(false);
                        }
                      }}>
                        <FileText className="h-4 w-4 mr-2" />
                        Load Text
                      </Button>
                      <Button variant="default" size="sm" asChild>
                        <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/documents/${documentId}/file`} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          View/Download Original
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* CLAUSES */}
          {activeView === "clauses" && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Extracted Clauses</CardTitle>
                    <CardDescription>{filteredClauses.length} clauses identified in this contract</CardDescription>
                  </div>
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search clauses..." value={clauseSearch} onChange={(e) => setClauseSearch(e.target.value)} className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-1/4">Clause</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Value</th>
                        <th className="text-center p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredClauses.length > 0 ? filteredClauses.map(([key, value]) => (
                        <tr key={key} className="hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <span className="text-sm font-medium">{CLAUSE_LABELS[key] || key.replace(/([A-Z])/g, " $1").trim()}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-muted-foreground line-clamp-2">
                              {Array.isArray(value) ? value.join(", ") : String(value)}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={3} className="p-12 text-center">
                            <FileText className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                            <p className="text-sm text-muted-foreground">No clauses found matching your search</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ISSUES */}
          {activeView === "issues" && (
            <div className="space-y-6">
              {/* Red Flags */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Red Flags</CardTitle>
                      <CardDescription>{redFlagCount} potential issues detected</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {analysis.redFlags?.length ? (
                    <div className="space-y-3">
                      {analysis.redFlags.map((flag, i) => (
                        <div key={i} className="rounded-xl border p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <SeverityBadge severity={flag.severity} />
                                {flag.location && (
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{flag.location}</span>
                                )}
                              </div>
                              <h4 className="font-semibold text-sm mb-1">{flag.issue}</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{flag.explanation}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="shrink-0"
                              onClick={async () => {
                                try {
                                  const result = await fix(flag.clauseText, flag.issue, analysis.documentType);
                                  setFixResult({
                                    issue: flag.issue,
                                    fixed: result.fixed_clause,
                                    explanation: result.explanation,
                                    negotiation: result.negotiation_wording,
                                  });
                                } catch {}
                              }}
                              disabled={isFixing}
                            >
                              {isFixing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4 mr-1.5" /> Get Fix</>}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 mx-auto text-emerald-500/40 mb-3" />
                      <p className="font-medium">No red flags detected</p>
                      <p className="text-sm text-muted-foreground mt-1">This contract looks good!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Missing Clauses */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Minus className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Missing Clauses</CardTitle>
                      <CardDescription>{missingCount} recommended clauses not found</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {analysis.missingClauses?.length ? (
                    <div className="grid grid-cols-2 gap-4">
                      {analysis.missingClauses.map((clause, i) => (
                        <div key={i} className="rounded-xl border p-5 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-3">
                            <SeverityBadge severity={clause.importance} />
                          </div>
                          <h4 className="font-semibold text-sm mb-2">{clause.clauseName.replace(/([A-Z])/g, " $1").trim()}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{clause.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 mx-auto text-emerald-500/40 mb-3" />
                      <p className="font-medium">All essential clauses present</p>
                      <p className="text-sm text-muted-foreground mt-1">No missing clauses detected</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}


          {/* Fix Result Modal */}
          {fixResult && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setFixResult(null)}>
              <Card className="max-w-2xl w-full max-h-[85vh] overflow-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">AI-Suggested Fix</CardTitle>
                        <CardDescription className="mt-0.5">{fixResult.issue}</CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setFixResult(null)}>
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fixed Clause</p>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleCopy(fixResult.fixed)}>
                        {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm leading-relaxed">{fixResult.fixed}</div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Why This Fix?</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{fixResult.explanation}</p>
                  </div>
                  {fixResult.negotiation && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Negotiation Wording</p>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm leading-relaxed italic">{fixResult.negotiation}</div>
                    </div>
                  )}
                  <Button className="w-full" onClick={() => handleCopy(fixResult.fixed)}>
                    <Copy className="h-4 w-4 mr-2" /> Copy Fixed Clause
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* CHAT */}
          {activeView === "chat" && (
            <Card className="border-0 shadow-sm max-w-3xl mx-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Contract Q&A</CardTitle>
                      <CardDescription>Ask questions about this contract</CardDescription>
                    </div>
                  </div>
                  {chatHistory.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearChat}>Clear Chat</Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ChatPanel messages={chatHistory} onSendMessage={chat} onClear={clearChat} isLoading={isChatting} />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
