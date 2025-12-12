import { create } from 'zustand';
import { Analysis } from './api';

interface AppState {
  // Current document
  currentDocumentId: string | null;
  currentAnalysis: Analysis | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentDocument: (id: string | null) => void;
  setCurrentAnalysis: (analysis: Analysis | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentDocumentId: null,
  currentAnalysis: null,
  isLoading: false,
  error: null,
  
  setCurrentDocument: (id) => set({ currentDocumentId: id }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({
    currentDocumentId: null,
    currentAnalysis: null,
    isLoading: false,
    error: null,
  }),
}));
