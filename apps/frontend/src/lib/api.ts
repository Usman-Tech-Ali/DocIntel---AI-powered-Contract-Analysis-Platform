import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes for analysis
});

export interface UploadResponse {
  id: string;
  fileName: string;
  status: string;
}

export interface RiskScore {
  score: number;
  level: 'green' | 'yellow' | 'red';
  summary: string;
  factors?: Array<{ factor: string; impact: number }>;
}

export interface Summary {
  bulletPoints: string[];
  obligations: string[];
  rights: string[];
  paymentSummary: string;
  mainRisks: string[];
}

export interface RedFlag {
  id: string;
  clauseText: string;
  issue: string;
  severity: 'green' | 'yellow' | 'red';
  explanation: string;
  location?: string;
}

export interface MissingClause {
  clauseName: string;
  importance: 'critical' | 'important' | 'recommended';
  description: string;
  suggestedText: string;
}

export interface JurisdictionInfo {
  governingLaw: string;
  jurisdiction: string;
  isValid: boolean;
  warnings: string[];
  recommendations?: string[];
}

export interface ClauseFix {
  original_clause: string;
  fixed_clause: string;
  explanation: string;
  negotiation_wording: string;
}

export interface ChatResponse {
  answer: string;
  citations: string[];
  related_clauses: string[];
  follow_up_questions: string[];
}

export interface Analysis {
  id: string;
  documentId: string;
  documentType: string;
  detectedLanguage: string;
  analyzedAt: string;
  summary: Summary;
  riskScore: RiskScore;
  extractedClauses: Record<string, any>;
  missingClauses: MissingClause[];
  redFlags: RedFlag[];
  jurisdictionInfo: JurisdictionInfo;
}

// Upload document
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

// Analyze document
export async function analyzeDocument(documentId: string, language?: string): Promise<Analysis> {
  const response = await api.post(`/api/documents/${documentId}/analyze`, { language });
  return response.data;
}

// Get analysis
export async function getAnalysis(documentId: string): Promise<Analysis> {
  const response = await api.get(`/api/documents/${documentId}/analysis`);
  return response.data;
}

// Chat with document
export async function chatWithDocument(
  documentId: string,
  message: string,
  language: string = 'en',
  history: Array<{ role: string; content: string }> = []
): Promise<ChatResponse> {
  const response = await api.post(`/api/documents/${documentId}/chat`, {
    message,
    language,
    history
  });
  return response.data;
}

// Fix clause
export async function fixClause(
  clauseText: string,
  issue: string,
  context?: string
): Promise<ClauseFix> {
  const response = await api.post('/api/fix-clause', {
    clauseText,
    issue,
    context
  });
  return response.data;
}

// Download report
export async function downloadReport(documentId: string): Promise<Blob> {
  const response = await api.get(`/api/documents/${documentId}/report`, {
    responseType: 'blob'
  });
  return response.data;
}

// List documents
export async function listDocuments(): Promise<any[]> {
  const response = await api.get('/api/documents');
  return response.data;
}

// Delete document
export async function deleteDocument(documentId: string): Promise<void> {
  await api.delete(`/api/documents/${documentId}`);
}

export default api;
