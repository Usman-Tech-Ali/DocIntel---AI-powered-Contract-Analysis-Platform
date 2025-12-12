// Contract Analysis Types for DocIntel

// Document Types
export type DocumentType = 
  | 'nda'
  | 'employment'
  | 'service_agreement'
  | 'vendor_contract'
  | 'lease'
  | 'saas_agreement'
  | 'partnership_agreement'
  | 'loan_agreement'
  | 'freelance_contract'
  | 'unknown';

// Risk Levels
export type RiskLevel = 'green' | 'yellow' | 'red';

export interface RiskScore {
  score: number; // 0-100
  level: RiskLevel;
  summary: string;
}

// Extracted Clauses (30+ fields)
export interface ExtractedClauses {
  paymentTerms?: string;
  paymentAmount?: string;
  paymentSchedule?: string;
  milestones?: string[];
  dueDates?: string[];
  terminationNoticePeriod?: string;
  terminationConditions?: string;
  liabilityLimitations?: string;
  liabilityCap?: string;
  ipOwnership?: string;
  workOwnership?: string;
  confidentialityRequirements?: string;
  confidentialityDuration?: string;
  revisionCount?: string;
  revisionTerms?: string;
  governingLaw?: string;
  jurisdiction?: string;
  nonCompete?: string;
  nonCompeteDuration?: string;
  nonSolicit?: string;
  disputeResolution?: string;
  arbitrationClause?: string;
  deliverables?: string[];
  scopeOfWork?: string;
  refundRules?: string;
  deadlines?: string[];
  renewalTerms?: string;
  autoRenewal?: boolean;
  contractDuration?: string;
  startDate?: string;
  endDate?: string;
  killFee?: string;
  latePaymentPenalty?: string;
  indemnification?: string;
  forceMAjeure?: string;
  assignmentRights?: string;
  amendmentProcess?: string;
  noticeRequirements?: string;
  warrantyTerms?: string;
  insuranceRequirements?: string;
}

// Missing Clauses Detection
export interface MissingClause {
  clauseName: string;
  importance: 'critical' | 'important' | 'recommended';
  description: string;
  suggestedText: string;
}

// Red Flags
export interface RedFlag {
  id: string;
  clauseText: string;
  issue: string;
  severity: RiskLevel;
  explanation: string;
  location?: string;
}

// Clause Fix Suggestion
export interface ClauseFix {
  originalClause: string;
  fixedClause: string;
  explanation: string;
  negotiationWording: string;
}

// Jurisdiction Info
export interface JurisdictionInfo {
  governingLaw: string;
  jurisdiction: string;
  isValid: boolean;
  warnings: string[];
  lastUpdated?: string;
}

// Chat Message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
}

// Full Analysis Result
export interface ContractAnalysis {
  id: string;
  documentId: string;
  documentType: DocumentType;
  fileName: string;
  uploadedAt: Date;
  analyzedAt: Date;
  
  // Feature 2: Plain-English Summary
  summary: string[];
  
  // Feature 3: Risk Score
  riskScore: RiskScore;
  
  // Feature 4: Extracted Clauses
  extractedClauses: ExtractedClauses;
  
  // Feature 5: Missing Clauses
  missingClauses: MissingClause[];
  
  // Feature 6: Red Flags
  redFlags: RedFlag[];
  
  // Feature 7: Clause Fixes
  suggestedFixes: ClauseFix[];
  
  // Feature 10: Jurisdiction
  jurisdictionInfo: JurisdictionInfo;
  
  // Raw extracted text
  rawText: string;
  
  // Language detected
  detectedLanguage: string;
}

// Document Upload Response
export interface DocumentUploadResponse {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  status: 'processing' | 'completed' | 'failed';
}

// Analysis Request
export interface AnalysisRequest {
  documentId: string;
  options?: {
    language?: string;
    includeChat?: boolean;
  };
}

// Chat Request
export interface ChatRequest {
  documentId: string;
  message: string;
  language?: string;
  conversationHistory?: ChatMessage[];
}

// Chat Response
export interface ChatResponse {
  message: string;
  citations: string[];
}

// Report Generation
export interface ReportOptions {
  includeAnnotations: boolean;
  includeRiskHighlights: boolean;
  includeSuggestions: boolean;
  format: 'pdf' | 'html';
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  tokensRemaining: number;
  plan: 'free' | 'pro' | 'enterprise';
}

// Document in database
export interface Document {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
  analysis?: ContractAnalysis;
  createdAt: Date;
  updatedAt: Date;
}
