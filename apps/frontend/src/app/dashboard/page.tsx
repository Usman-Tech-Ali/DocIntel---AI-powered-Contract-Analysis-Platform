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
  TrendingUp,
  Shield,
  BarChart3,
  DollarSign,
  Files,
  Edit,
  ArrowRight,
  ChevronDown,
  Grid3x3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[hsl(var(--primary))] dark:text-blue-400 font-medium transition-colors"
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
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
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search"
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
              Pages / <span className="text-slate-900 dark:text-white font-medium">Dashboard</span>
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">Dashboard</h2>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Daily Traffic */}
            <Card className="lg:col-span-1 border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Daily Traffic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">2.579</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Visitors</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">+2.45%</span>
                </div>
                {/* Bar Chart */}
                <div className="h-32 flex items-end gap-2">
                  {[65, 45, 80, 55, 70, 90].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t transition-all hover:opacity-80"
                        style={{
                          height: `${height}%`,
                          background: "linear-gradient(to top, #3b82f6, #06b6d4)",
                        }}
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {["00", "04", "08", "12", "16", "18"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="lg:col-span-1 border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Your Pie Chart
                </CardTitle>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 bg-white dark:bg-slate-700 dark:text-white focus:border-[hsl(var(--primary))] focus:outline-none"
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  {/* Pie Chart SVG */}
                  <svg width="200" height="200" viewBox="0 0 200 200" className="mb-4">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="40"
                      strokeDasharray={`${67 * 2 * Math.PI * 0.8} ${100 * 2 * Math.PI * 0.8}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="40"
                      strokeDasharray={`${20 * 2 * Math.PI * 0.8} ${100 * 2 * Math.PI * 0.8}`}
                      strokeDashoffset={`-${67 * 2 * Math.PI * 0.8}`}
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke={theme === "dark" ? "#475569" : "#e2e8f0"}
                      strokeWidth="40"
                      strokeDasharray={`${13 * 2 * Math.PI * 0.8} ${100 * 2 * Math.PI * 0.8}`}
                      strokeDashoffset={`-${87 * 2 * Math.PI * 0.8}`}
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-800" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Risk</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">67%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">Minor Risk</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-300">No Risk</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">13%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Safety */}
            <Card className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Wanna know more about safety of your documents?
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                    Discover our system's security, with one tap.
                  </p>
                  <Button className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white shadow-md">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tokens and Balance */}
            <Card className="lg:col-span-1 border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                  Tokens & Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Monthly Tokens</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">400</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg border border-cyan-100 dark:border-cyan-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-sm">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Tokens Consumed</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">150</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-400 dark:bg-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-bold">$</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Your balance</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">$10</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
              </CardContent>
            </Card>

            {/* Total Documents */}
            <Card className="lg:col-span-1 xl:col-span-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center shadow-sm">
                    <Files className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                      Total Documents
                    </CardTitle>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">13</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Document 1 */}
                  <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                      PH
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Pt Holmes Stakes Agreement
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Document #1 See document details
                      </p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                  {/* Document 2 */}
                  <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                      JC
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Jimmy Carter Insurance Claim
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Document #2 See document details
                      </p>
                    </div>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                      <Edit className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white shadow-md">
                  View Documents
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
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
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Grid3x3 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
