"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, ArrowUpRight, Clock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listDocuments } from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface DocumentSummary {
  id: string;
  fileName: string;
  status: string;
  uploadedAt: string;
  riskLevel?: "green" | "yellow" | "red";
  riskScore?: number;
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: documents.length,
    analyzed: documents.filter((d) => d.status === "analyzed").length,
    highRisk: documents.filter((d) => d.riskLevel === "red").length,
    safe: documents.filter((d) => d.riskLevel === "green").length,
  };

  const activityData = [
    { name: "Mon", value: 2 },
    { name: "Tue", value: 5 },
    { name: "Wed", value: 3 },
    { name: "Thu", value: 8 },
    { name: "Fri", value: 4 },
    { name: "Sat", value: 1 },
    { name: "Sun", value: 6 },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: stats.safe || 1, color: "#18181b" },
    { name: "Medium Risk", value: Math.max(stats.total - stats.safe - stats.highRisk, 1), color: "#71717a" },
    { name: "High Risk", value: stats.highRisk || 1, color: "#d4d4d8" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-56">
        <div className="sticky top-0 z-40">
          <Header title="Dashboard" />
        </div>
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Documents", value: stats.total, change: "+12%" },
              { label: "Analyzed", value: stats.analyzed, change: "+8%" },
              { label: "High Risk", value: stats.highRisk, change: "-2%" },
              { label: "Low Risk", value: stats.safe, change: "+15%" },
            ].map((stat, i) => (
              <Card key={i} className="border">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-semibold">{stat.value}</span>
                    <span className="text-xs text-muted-foreground">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="col-span-2 border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Analysis Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">This Week</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[200px] w-full min-w-[200px]">
                  <ResponsiveContainer width="100%" height={200} minWidth={200}>
                    <AreaChart data={activityData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="value" stroke="#18181b" strokeWidth={2} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[140px] w-full min-w-[140px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={140} minWidth={140}>
                    <PieChart>
                      <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {riskDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="border bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold mb-1">Upload Contract</h3>
                  <p className="text-sm opacity-70">Get instant AI analysis with risk scores.</p>
                </div>
                <Link href="/documents/new">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Analysis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="col-span-2 border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Recent Documents</CardTitle>
                  <Link href="/documents">
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                      View All <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">No documents yet</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {documents.slice(0, 4).map((doc) => (
                      <Link key={doc.id} href={`/documents/${doc.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{doc.fileName}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.riskScore !== undefined && (
                              <span className="text-xs font-medium px-2 py-1 rounded bg-secondary">{doc.riskScore}/100</span>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
