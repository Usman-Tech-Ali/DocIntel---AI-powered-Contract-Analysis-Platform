"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Info,
  LayoutDashboard,
  FileText,
  History,
  User,
  LogOut,
  Upload,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface DocumentHistoryItem {
  id: string;
  name: string;
  status: "analyzed" | "analyzing" | "cancelled";
  date: string;
  riskPercent: number;
}

const historyData: DocumentHistoryItem[] = [
  {
    id: "1",
    name: "Horizon Firm Legal Docs",
    status: "analyzed",
    date: "18 Apr 2021",
    riskPercent: 15,
  },
  {
    id: "2",
    name: "Clause Change J&P Morgan",
    status: "cancelled",
    date: "18 Apr 2021",
    riskPercent: 8,
  },
  {
    id: "3",
    name: "Steve Harvey's Insurance Claim",
    status: "analyzing",
    date: "20 May 2021",
    riskPercent: 45,
  },
  {
    id: "4",
    name: "Mike Proposal",
    status: "analyzed",
    date: "12 Jul 2021",
    riskPercent: 32,
  },
  {
    id: "5",
    name: "Devora Solutions Shareholding",
    status: "analyzed",
    date: "18 Apr 2021",
    riskPercent: 28,
  },
  {
    id: "6",
    name: "Bridge Coup",
    status: "cancelled",
    date: "18 Apr 2021",
    riskPercent: 12,
  },
  {
    id: "7",
    name: "Job Agreement",
    status: "analyzing",
    date: "20 May 2021",
    riskPercent: 38,
  },
  {
    id: "8",
    name: "Amenities Clause",
    status: "analyzed",
    date: "12 Jul 2021",
    riskPercent: 25,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "analyzed":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "analyzing":
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case "cancelled":
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium capitalize";
  switch (status) {
    case "analyzed":
      return cn(baseClasses, "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400");
    case "analyzing":
      return cn(baseClasses, "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400");
    case "cancelled":
      return cn(baseClasses, "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400");
    default:
      return baseClasses;
  }
};

export default function HistoryPage() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = historyData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm transition-colors duration-300">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo 2.png"
                alt="DocIntel Logo"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">docintel</span>
          </div>
        </div>

        {/* Upload Button */}
        <div className="p-4">
          <Button className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white shadow-md">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/documents"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            My Documents
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[hsl(var(--primary))] dark:text-blue-400 font-medium transition-colors"
          >
            <History className="w-5 h-5" />
            History
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <User className="w-5 h-5" />
            Profile
          </Link>
          <Link
            href="/sign-in"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Link>
        </nav>

        {/* Upgrade to PRO */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm font-semibold mb-1">Upgrade to PRO</p>
            <p className="text-xs opacity-90 mb-3">
              to get access to all features! Connect with Venus World!
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="w-full bg-white text-[hsl(var(--primary))] hover:bg-white/90 font-medium"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">History</h1>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white focus:border-[hsl(var(--primary))]"
                />
              </div>
              {/* Icons */}
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-slate-600 dark:text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <Info className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
              {/* Profile */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold shadow-md">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pages / <span className="text-slate-900 dark:text-white font-medium">History</span>
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">History</h2>
          </div>

          {/* Document History Card */}
          <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Document History
              </CardTitle>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </CardHeader>
            <CardContent>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-right py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                        Risk %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr
                        key={item.id}
                        className={cn(
                          "border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors",
                          index === filteredData.length - 1 && "border-b-0"
                        )}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                              {item.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <span className={getStatusBadge(item.status)}>{item.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{item.date}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-3">
                            {/* Risk Bar */}
                            <div className="flex-1 max-w-[120px] h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  item.riskPercent < 20
                                    ? "bg-green-500"
                                    : item.riskPercent < 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                )}
                                style={{ width: `${item.riskPercent}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white min-w-[40px] text-right">
                              {item.riskPercent}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredData.length === 0 && (
                <div className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    No documents found
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    Try adjusting your search query
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Total Documents
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {historyData.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Analyzed
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {historyData.filter((d) => d.status === "analyzed").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Average Risk
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {Math.round(
                        historyData.reduce((acc, d) => acc + d.riskPercent, 0) /
                          historyData.length
                      )}
                      %
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © 2025 Docintel. All Rights Reserved. Made with love by{" "}
                <span className="text-[hsl(var(--primary))] font-medium">Dawood!</span>
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="#"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Marketplace
                </Link>
                <Link
                  href="#"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  License
                </Link>
                <Link
                  href="#"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Terms of Use
                </Link>
                <Link
                  href="#"
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

