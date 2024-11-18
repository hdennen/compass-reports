import { create } from 'zustand';

export interface AssessmentState {
  rawData: any[]; // Replace 'any' with your specific data type
  isLoading: boolean;
  error: string | null;
  setRawData: (data: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  rawData: [],
  isLoading: false,
  error: null,
  setRawData: (data) => set({ rawData: data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));