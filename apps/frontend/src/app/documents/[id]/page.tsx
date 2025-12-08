"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileIcon,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export default function DocumentViewPage() {
  const { id } = useParams();
  const { theme, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(17);
  const [zoom, setZoom] = useState(100);

  const documentTitle = "J&P Morgan's Suit";

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

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
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[hsl(var(--primary))] dark:text-blue-400 font-medium transition-colors"
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
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Pages / Documents
              </p>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {documentTitle}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <Input
                  type="search"
                  placeholder="Q Search"
                  className="pl-10 w-48 border-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white focus:border-[hsl(var(--primary))]"
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
          <div className="flex gap-6">
            {/* Left Side - Document Viewer */}
            <div className="flex-1">
              <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                    Document Analysis
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Page Navigation */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-2">
                        Page {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>
                    {/* Zoom Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <ZoomOut className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[50px] text-center">
                        {zoom}%
                      </span>
                      <button
                        onClick={handleZoomIn}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Document Preview */}
                  <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-8 min-h-[600px] flex items-center justify-center overflow-hidden">
                    {/* Stacked Documents Effect */}
                    <div className="relative w-full max-w-2xl">
                      {/* Background Document */}
                      <div className="absolute top-4 left-4 w-full h-full bg-white dark:bg-slate-700 rounded shadow-lg transform rotate-2 opacity-60"></div>
                      
                      {/* Main Document */}
                      <div
                        className="relative bg-white dark:bg-slate-700 rounded-lg shadow-xl p-8"
                        style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                      >
                        {/* Document Content with Highlights */}
                        <div className="space-y-4 text-slate-800 dark:text-slate-200">
                          {/* Pink Highlight Section */}
                          <div className="relative p-4 bg-pink-200/50 dark:bg-pink-900/30 rounded border-l-4 border-pink-500">
                            <h3 className="font-semibold mb-2">Service Agreement</h3>
                            <p className="text-sm">
                              This contract outlines a service agreement between the parties,
                              defining responsibilities, payment structure, and termination terms.
                            </p>
                          </div>

                          {/* Yellow Highlight Section */}
                          <div className="relative p-4 bg-yellow-200/50 dark:bg-yellow-900/30 rounded border-l-4 border-yellow-500">
                            <h3 className="font-semibold mb-2">Key Obligations</h3>
                            <p className="text-sm">
                              Key obligations include timely delivery of work, confidentiality, and
                              ownership of deliverables.
                            </p>
                          </div>

                          {/* Green Highlight Section */}
                          <div className="relative p-4 bg-green-200/50 dark:bg-green-900/30 rounded border-l-4 border-green-500">
                            <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                            <p className="text-sm">
                              No immediate red flags are visible, but several clauses may require
                              clarification depending on the scope of work.
                            </p>
                          </div>

                          {/* Additional Content */}
                          <div className="mt-6 space-y-2 text-sm">
                            <p>
                              The parties agree to the following terms and conditions as outlined in
                              this document. All provisions are subject to applicable law and
                              jurisdiction.
                            </p>
                            <p>
                              Payment terms, delivery schedules, and performance metrics are
                              detailed in subsequent sections of this agreement.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Overview & Risk Analysis */}
            <div className="w-96 space-y-6">
              {/* Overview */}
              <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileIcon className="w-5 h-5" />
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Plain Summary
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        This contract outlines a service agreement between the parties, defining
                        responsibilities, payment structure, and termination terms. Key obligations
                        include timely delivery of work, confidentiality, and ownership of
                        deliverables. No immediate red flags are visible, but several clauses may
                        require clarification depending on the scope of work.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Responsibility Loopholes - Red Warning */}
                  <div className="border-2 border-red-500 dark:border-red-600 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                          Responsibility Loopholes
                        </h4>
                        <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                          Our analysis found multiple elements that could create potential conflicts,
                          financial exposure, or unclear obligations. These issues may affect payment
                          protection, deliverable ownership, or your rights under the agreement.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Higher Responsibility - Yellow Warning */}
                  <div className="border-2 border-yellow-500 dark:border-yellow-600 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                          Higher Responsibility for X Person
                        </h4>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                          Our analysis found multiple elements that could create potential conflicts,
                          financial exposure, or unclear obligations. These issues may affect payment
                          protection, deliverable ownership, or your rights under the agreement.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Positive Note */}
                  <div className="border-2 border-green-500 dark:border-green-600 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                          Strengths
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                          The contract includes clear payment terms and well-defined deliverables.
                          Confidentiality clauses are comprehensive and protect both parties.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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

