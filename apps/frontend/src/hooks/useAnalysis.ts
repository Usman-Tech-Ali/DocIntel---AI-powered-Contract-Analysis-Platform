"use client";

import { useState, useCallback } from 'react';
import { 
  uploadDocument, 
  analyzeDocument, 
  getAnalysis, 
  chatWithDocument,
  fixClause,
  downloadReport,
  downloadCorrectedContract,
  Analysis,
  ChatResponse,
  ClauseFix
} from '@/lib/api';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

export function useAnalysis() {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const upload = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const result = await uploadDocument(file);
      setDocumentId(result.id);
      return result;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const analyze = useCallback(async (docId?: string, language?: string) => {
    const id = docId || documentId;
    if (!id) {
      setError('No document to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeDocument(id, language);
      setAnalysis(result);
      return result;
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, [documentId]);

  const fetchAnalysis = useCallback(async (docId: string) => {
    setError(null);
    try {
      const result = await getAnalysis(docId);
      setDocumentId(docId); // Set documentId first
      setAnalysis(result);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Failed to fetch analysis';
      setError(message);
      throw err;
    }
  }, []);

  const chat = useCallback(async (message: string, language: string = 'en') => {
    if (!documentId) {
      setError('No document selected');
      return;
    }

    setIsChatting(true);
    setError(null);

    // Add user message immediately for better UX
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const history = chatHistory.map(m => ({ role: m.role, content: m.content }));
      const result = await chatWithDocument(documentId, message, language, history);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.answer,
        citations: result.citations
      };
      setChatHistory(prev => [...prev, assistantMessage]);
      
      return result;
    } catch (err: any) {
      // Remove the user message if chat failed
      setChatHistory(prev => prev.slice(0, -1));
      const errorMsg = err.response?.data?.error || err.message || 'Chat failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsChatting(false);
    }
  }, [documentId, chatHistory]);

  const fix = useCallback(async (clauseText: string, issue: string, context?: string): Promise<ClauseFix> => {
    setIsFixing(true);
    setError(null);
    try {
      const result = await fixClause(clauseText, issue, context);
      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fix clause';
      setError(errorMsg);
      throw err;
    } finally {
      setIsFixing(false);
    }
  }, []);

  const downloadPdf = useCallback(async () => {
    if (!documentId) {
      setError('No document selected');
      return;
    }

    try {
      const blob = await downloadReport(documentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract-analysis-${documentId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to download report');
      throw err;
    }
  }, [documentId]);

  const downloadCorrected = useCallback(async (fixes?: any[]) => {
    if (!documentId) {
      setError('No document selected');
      return;
    }

    try {
      const blob = await downloadCorrectedContract(documentId, fixes);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `corrected-contract-${documentId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to download corrected contract');
      throw err;
    }
  }, [documentId]);

  const clearChat = useCallback(() => {
    setChatHistory([]);
  }, []);

  const reset = useCallback(() => {
    setDocumentId(null);
    setAnalysis(null);
    setChatHistory([]);
    setError(null);
  }, []);

  return {
    // State
    isUploading,
    isAnalyzing,
    isChatting,
    isFixing,
    error,
    documentId,
    analysis,
    chatHistory,
    // Actions
    upload,
    analyze,
    fetchAnalysis,
    chat,
    fix,
    downloadPdf,
    downloadCorrected,
    clearChat,
    reset
  };
}
