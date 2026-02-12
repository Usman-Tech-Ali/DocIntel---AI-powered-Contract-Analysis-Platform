"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, Trash2, Loader2, Search, Upload, Clock, Shield, MoreVertical, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { listDocuments, deleteDocument } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: string;
  mimeType?: string;
  riskLevel?: "green" | "yellow" | "red";
  riskScore?: number;
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    analyzed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    processing: "bg-blue-100 text-blue-700 border-blue-200",
    uploaded: "bg-slate-100 text-slate-700 border-slate-200",
    failed: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium capitalize", styles[status] || styles.uploaded)}>
      {status}
    </span>
  );
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this document?")) return;
    
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-56">
        <div className="sticky top-0 z-40">
          <Header title="Documents" showSearch={false} />
        </div>
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64 h-9"
              />
            </div>
            <Link href="/documents/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">NAME</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">DATE</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">STATUS</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">RISK</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-3">
                        <Link href={`/documents/${doc.id}`} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium hover:underline">{doc.fileName}</span>
                        </Link>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-1 rounded bg-secondary">{doc.status}</span>
                      </td>
                      <td className="p-3">
                        {doc.riskScore !== undefined ? (
                          <span className="text-sm font-medium">{doc.riskScore}/100</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={(e) => handleDelete(doc.id, e)}
                          disabled={deletingId === doc.id}
                        >
                          {deletingId === doc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 border rounded-lg">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium mb-1">{searchQuery ? "No documents found" : "No documents yet"}</p>
              <p className="text-xs text-muted-foreground mb-4">{searchQuery ? "Try a different search" : "Upload your first contract"}</p>
              {!searchQuery && (
                <Link href="/documents/new">
                  <Button size="sm"><Plus className="h-4 w-4 mr-2" />Upload</Button>
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
