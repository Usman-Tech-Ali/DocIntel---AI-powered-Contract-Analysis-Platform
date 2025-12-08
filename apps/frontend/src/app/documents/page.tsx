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
  Plus,
  FilePlus,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  title: string;
  date: string;
  type?: string;
}

const documentsData: Document[] = [
  {
    id: "1",
    title: "J&P Morgan Clause Changes",
    date: "12/2/2025",
    type: "Contract",
  },
  {
    id: "2",
    title: "Estella Notes",
    date: "10/2/2025",
    type: "Notes",
  },
  {
    id: "3",
    title: "Birmingham Lawsuit",
    date: "8/2/2025",
    type: "Legal",
  },
  {
    id: "4",
    title: "System Partnership Doc",
    date: "5/2/2025",
    type: "Partnership",
  },
  {
    id: "5",
    title: "Shareholding Clauses",
    date: "3/2/2025",
    type: "Contract",
  },
  {
    id: "6",
    title: "J&P Morgan Clause Changes",
    date: "1/2/2025",
    type: "Contract",
  },
];

export default function DocumentsPage() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = documentsData.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Documents</h1>
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
              Pages / <span className="text-slate-900 dark:text-white font-medium">Documents</span>
            </p>
            <div className="flex items-center justify-between mt-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Documents</h2>
            </div>
          </div>

          {/* Documents Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Documents</h3>
            <Button className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
          </div>

          {/* Documents Grid */}
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredDocuments.map((doc) => (
                <Card
                  key={doc.id}
                  className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Document Icon */}
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex flex-col items-center justify-center text-white shadow-md">
                          <FilePlus className="w-6 h-6 mb-1" />
                          <div className="flex gap-0.5">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        </div>

                        {/* Document Info */}
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                            {doc.title}
                          </h4>
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{doc.date}</span>
                            {doc.type && (
                              <>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="text-sm">{doc.type}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* View Document Button */}
                      <Link href={`/documents/${doc.id}`}>
                        <Button
                          variant="outline"
                          className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white border-0 shadow-md"
                        >
                          View Document
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800 shadow-sm">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium text-lg mb-2">
                  No documents found
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Upload your first document to get started"}
                </p>
                {!searchQuery && (
                  <Button className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

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

